# Project intake and professional contact — 30 October 2026

## Current owner decisions

The owner replaced the initial direct-WhatsApp approach with a short project questionnaire and requested Google Forms to reduce custom maintenance. The professional WhatsApp number should not be displayed prominently. The owner explicitly approved `samuelbrito782@gmail.com` for recruitment and other professional contacts. The Google Form has not been created: the owner requested a ready-to-copy template.

The [Portuguese owner template](GOOGLE_FORMS_MODELO_PTBR.md) provides three context questions plus one return-contact field, confirmation copy and publication steps. No form was created in a connected Google account, no fake responder URL was inserted and no external response was submitted.

## Website behavior

`ContactSection` reads the optional server/build setting `PROJECT_INTAKE_FORM_URL`. With a valid published Google Forms responder link, it renders **Descrever meu projeto** in another tab and a separate direct email for recruitment. It does not embed an iframe, load a Forms SDK, collect questionnaire answers or show the WhatsApp number.

Until the real URL exists, or if configuration is invalid, the section renders a working **Enviar e-mail** link to the approved address. It does not render a dead questionnaire button, editor URL or unfinished setup instructions to visitors. The section remains server-rendered and usable without JavaScript. The email link opens the visitor's mail application; it does not use Resend or the retained contact API.

`src/lib/contact/intake-form.ts` accepts HTTPS responder URLs on `forms.gle` and `docs.google.com/forms/d/(e/)ID/viewform`. It rejects unrelated hosts, host lookalikes, non-HTTPS schemes, credentials, custom ports and editor URLs. It never fetches the supplied URL. `.env.example` documents the setting. Because the home is prerendered, configure the real public URL and rebuild/deploy after reviewing it.

The fixed WhatsApp link is provided in the owner's Forms confirmation template, not in the public website section. The proposed confirmation message does not automatically include questionnaire answers. Those stay in Google Forms and can be matched using the return-contact answer.

## Email service and prior checks

The [email diagnosis](CONTACT_DIAGNOSIS_2026-10-29.md) and origin correction remain relevant to a future restoration of the email form. No private delivery configuration was provisioned.

The initial direct-WhatsApp layout passed 111 unit tests and its production build. A focused browser run passed 26 cases with one existing mobile hover skip. A subsequent full run had 200 passes, 9 profile skips and one reduced-motion failure: the trace showed the main CSS request had status -1 and `response._failureText: net::ERR_NO_BUFFER_SPACE`, while another stylesheet loaded. A native request for the same main stylesheet then returned 200 (41,049 bytes); the unchanged failed test passed three consecutive reruns. The browser's buffer error is recorded; its underlying system cause is not established. The trace and full JSON report were preserved in `.cache/contact-whatsapp/` rather than reported as a clean full run.

This earlier run does not verify the final intake/email implementation. No production changes, real emails or WhatsApp messages were sent.

## Final-source verification

- `npm run check` passed TypeScript, ESLint, Prettier and all 129 tests in 15 unit-test files after the source change and again after updating browser coverage. The 18 added unit cases cover valid responder URLs, unsafe/editor URL rejection, email fallback and the configured Forms/recruitment split. Test-only form IDs are fixtures, not published forms.
- `npm run build` passed. The pre-existing warning about `C:/Users/samue/package-lock.json` outside this checkout remained non-blocking.
- Focused browser verification against the final production build: 26 passed, 1 existing mobile hover skip, zero failures (31.2 seconds). Email activation is intercepted before the OS mail handler opens, so it proves keyboard activation and the correct `mailto:` destination, not delivery.
- Real same-origin browser POST validation remains covered without route interception. Invalid input returns 400 before any provider call.
- Visual inspection at 320, 390, 820 and 1440 pixels found no horizontal overflow or page errors; the action height was approximately 54 pixels. Screenshots in `.cache/contact-intake/` were inspected at mobile and desktop sizes, with no phone displayed.
- Full final-source browser regression: **201 passed, 9 existing profile skips, zero failures and zero flaky cases** in 243 seconds (4.1 minutes), across desktop, desktop-touch and mobile Edge/Chromium profiles. First-load, fluidity, native scrolling, reduced motion, project navigation and the contact checks passed. Raw JSON: `.cache/contact-intake/full-e2e.json`. This is a local automated run, not a measurement of field Core Web Vitals or external message delivery.

The Google Forms mode is component-tested with fixture URLs. An actual responder-page/submission/confirmation test is pending the owner creating and sharing the published form; it is not represented as complete.

## Activate and review

1. The owner creates and publishes the form from the template, then sends the responder URL.
2. Configure `PROJECT_INTAKE_FORM_URL` locally, rebuild and verify the actual form in a signed-out/private browser, including availability, questions and confirmation behavior.
3. Run `npm run check`, `npm run build` and the browser suite against that unchanged build. On this Windows setup, start `next start --hostname 127.0.0.1 --port 3400` separately and set `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3400`, `PLAYWRIGHT_CHANNEL=msedge`, then run `node node_modules/@playwright/test/cli.js test --workers=1`.
4. Present the concrete preview and results for the owner's approval before publishing. No public form URL or production environment was changed in this iteration.
