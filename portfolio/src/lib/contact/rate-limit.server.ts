import { createHmac } from "node:crypto";
import { ContactServiceError } from "./failure.server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const windowMs = 10 * 60 * 1000;
const script =
  "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]); end; return {n,redis.call('PTTL',KEYS[1])}";

async function consume(
  key: string,
  limit: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (Boolean(url) !== Boolean(token)) throw new ContactServiceError("RATE_LIMIT_CONFIGURATION");
  if (url && token) {
    if (!url.startsWith("https://")) throw new ContactServiceError("RATE_LIMIT_CONFIGURATION");
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, "1", `portfolio:contact:${key}`, String(windowMs)]),
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Rate limiter unavailable");
    const data: { result?: unknown; error?: string } = await response.json();
    if (
      data.error ||
      !Array.isArray(data.result) ||
      data.result.length !== 2 ||
      !data.result.every((n) => typeof n === "number") ||
      data.result[1] < 0
    )
      throw new Error("Invalid rate limit result");
    return {
      allowed: data.result[0] <= limit,
      retryAfter: Math.max(1, Math.ceil(data.result[1] / 1000)),
    };
  }
  // Shared Redis is required for serverless/multiple processes. Memory mode must
  // be explicitly selected in production for a single persistent Node process.
  if (
    process.env.VERCEL === "1" ||
    (process.env.NODE_ENV === "production" && process.env.CONTACT_RATE_LIMIT_MODE !== "memory")
  )
    throw new ContactServiceError("RATE_LIMIT_NOT_CONFIGURED");
  const now = Date.now();
  for (const [id, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(id);
  if (buckets.size >= 5000 && !buckets.has(key)) return { allowed: false, retryAfter: 600 };
  const current = buckets.get(key);
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };
  bucket.count++;
  buckets.set(key, bucket);
  return {
    allowed: bucket.count <= limit,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export async function limitContact(email: string) {
  // Keys never contain plain visitor emails. A global quota also limits abuse
  // that rotates email addresses; no untrusted forwarded-IP headers are used.
  const secret = process.env.RESEND_API_KEY;
  if (!secret) throw new Error("Contact not configured");
  const key = createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
  const global = await consume("global", 30);
  if (!global.allowed) return global;
  return consume(key, 3);
}
