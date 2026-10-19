import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
const production = process.argv.includes("--production") || process.argv.includes("--vercel");
loadEnvConfig(process.cwd(), !production, { info() {}, error() {} });

// Report presence/validity only. Never output addresses, URLs, keys or tokens.
const required = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];
let ready = true;
for (const name of required) {
  const value = process.env[name]?.trim();
  const valid =
    Boolean(value) && (name === "RESEND_API_KEY" || /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value));
  console.log(`${valid ? "[OK]" : "[MISSING OR INVALID]"} ${name}`);
  ready &&= valid;
}
const shared = Boolean(
  process.env.UPSTASH_REDIS_REST_URL?.startsWith("https://") &&
  process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
);
const vercel = process.argv.includes("--vercel") || process.env.VERCEL === "1";
const memory = !vercel && (!production || process.env.CONTACT_RATE_LIMIT_MODE === "memory");
console.log(`${shared ? "[OK]" : memory ? "[LOCAL MEMORY]" : "[MISSING]"} shared rate limiting`);
ready &&= shared || memory;
console.log(
  ready
    ? "Configuration present. Verify sender domain and test actual delivery in Resend."
    : "Contact is not configured. Follow docs/DEPLOYMENT.md; do not paste secrets into chat or GitHub.",
);
process.exitCode = ready ? 0 : 1;
