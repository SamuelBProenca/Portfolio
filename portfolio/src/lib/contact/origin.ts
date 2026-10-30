/** Compare the browser origin to the HTTP transport target, not a canonicalized Next URL. */
export function isAllowedContactOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  // Preserve support for non-browser API clients; quotas and validation still apply.
  if (!origin) return true;
  try {
    const url = new URL(request.url);
    const host = request.headers.get("host");
    if (host !== null && (!host || /[\s/\\?#@,]/.test(host))) return false;
    // Forwarded host headers are intentionally not trusted.
    const target = host === null ? url : new URL(`${url.protocol}//${host}`);
    return origin === target.origin;
  } catch {
    return false;
  }
}
