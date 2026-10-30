# Contact delivery diagnosis — 29 October 2026

> Follow-up on 30 October: the owner chose professional WhatsApp as the current public contact channel. See [the channel change](CONTACT_WHATSAPP_2026-10-30.md). The email findings below remain relevant to future reactivation; the public form was removed rather than presented as operational.

## Confirmed production blocker

Vercel project `portfolio` (`prj_omIKJH23hFNffkZhuvGz5CHiVwPT`, owning account `team_FxLQ50o3rWY6CLVrlIoca5Na`) was inspected through project/environment metadata with decryption disabled. The inventory contains only `CURRICULUM_STUDIO_ORIGIN`, scoped to production; `hiddenProductionEnvCount` is zero. No secret values were requested, copied or logged.

The five contact variables are absent:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Latest listed production deployment: `dpl_5hJzeakFki8M2FtGxaRFAYF5Dxfi`, commit `b5e66fa13d957e4a88a0342167b18e024e4e6fee`, state READY. This diagnosis made no environment or deployment changes.

`POST /api/contact` validates input first, then checks the three delivery variables. Missing delivery configuration returns HTTP503 with `CONTACT_CONFIGURATION` before Resend is called. Once delivery variables exist, Vercel also requires the shared Redis quota store; memory mode is intentionally rejected on Vercel. Existing unit tests verify both paths. A successful build or mocked provider response does not establish actual email delivery.

## Public checks without sending mail

On29October, `https://www.samuelproenca.com/` returned200. A same-origin POST containing only `{}` returned400 and the expected field-validation errors. This confirmed public routing and origin validation for the canonical hostname without consuming delivery quota or sending message data.

Runtime log access through the Vercel integration returned403. The deployment-detail request returned404 even though project/deployment listings expose the production entry. No Vercel CLI was available in PATH for the mapped log fallback. These access limits are recorded rather than treated as an absence of errors. No provider authentication, verified-domain status or inbox delivery is claimed.

## Additional local origin failure

A real production-mode Next server was started on loopback with all five contact variables explicitly empty. Browser submission through `127.0.0.1:3442` returned403 before configuration validation. The browser sent matching Origin and Host values, but Next's internal request URL used `localhost:3442`. Empty-body native probes confirmed403 for the127origin and400 for thelocalhost origin. Repeating without an artificial `VERCEL` flag produced the same result; that flag was not the cause.

The prior comparison against `new URL(request.url).origin` rejected this legitimate loopback request. The correction uses the HTTP Host target and request protocol, falling back to the URL when no Host exists. It still compares complete origins, rejects cross-site fetch metadata and malformed Host values, and does not trust `X-Forwarded-Host`. This follows the target-origin approach described in the [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#identifying-the-target-origin). It is not a relaxation to accept arbitrary origins.

## Verification record

- Before changes:40 existing contact unit tests passed. The local configuration check failed as expected because this isolated checkout also has no contact credentials.
- New route regressions failed before the fix: the legitimate transport-host case was rejected, and malformed Host cases were not rejected at the origin boundary.
- After the fix:48 contact unit tests passed. A TypeScript check caught an inferred union with optional undefined properties in the new table; explicit case typing corrected it without changing assertions.
- Added a browser regression with no route interception: a real same-origin POST of invalid input must reach server validation and return400. It never reaches delivery.
- Follow-up on 30 October: the full check passed all 111 unit tests and the production build passed. A real same-origin browser POST returned 400 in desktop, desktop-touch and mobile profiles without route interception, confirming the local origin correction reaches server validation. The removed form's runtime submission was superseded by the requested WhatsApp channel; no real provider acceptance or inbox delivery is claimed. Further public contact verification is recorded in the WhatsApp follow-up.

## Activation needed

Configure the five variables privately in the Vercel project's Production environment and the relevant Preview environment, then create a fresh deployment. Use a plain sender address on the verified Resend domain and matching writable Upstash REST credentials. Existing deployments do not gain newly added environment values automatically.

The source correction is local on `codex/contact-origin-diagnosis-20261029`; it does not provision credentials or enable sending. No real email was sent, no successful provider acceptance was fabricated, and no production mutation was performed. An actual delivery test remains a separate step after configuration, using an explicitly agreed recipient and test message.
