# Professional WhatsApp contact — 30 October 2026

> Superseded during review: the owner chose a Google Forms questionnaire and direct professional email, with no number displayed in the site section. See [the current implementation](CONTACT_INTAKE_2026-10-30.md). The material below records the initial iteration only.

## Decision and behavior

The owner requested WhatsApp as the current contact channel while professional email is not configured and supplied `+55 19 98958-7907`. The home contact section now displays this number and a real `https://wa.me/5519989587907` link with a URL-encoded, editable greeting. The link opens another tab; the visitor must review and send the message in WhatsApp. No message is automatically sent and no delivery confirmation appears in the portfolio.

The link format follows the [official WhatsApp click-to-chat documentation](https://faq.whatsapp.com/5913398998672934/?locale=pt_BR). The fixed draft mentions the portfolio and a project or opportunity; it contains no visitor input. No widget, SDK, account integration, browser permission, environment variable or new dependency was added. The contact section remains server-rendered and works without JavaScript. GitHub and LinkedIn remain available as alternatives.

Edit the number, display label and draft in `src/components/contact-section.tsx` together if the business number changes. Styling lives in `src/styles/contact-section.module.css`, using existing tokens, visible focus, touch behavior and reduced-motion handling.

## Email diagnosis retained

The [previous diagnosis](CONTACT_DIAGNOSIS_2026-10-29.md) found missing Resend delivery and Redis quota configuration in production. This channel change does not activate email or configure a sender domain. `ContactForm`, the API route, delivery adapter and quota protections remain available in source, with their unit tests. The transport-host origin correction from that investigation is retained.

Before restoring the form, configure the five private variables described in the diagnosis, deploy and verify provider acceptance and delivery using an agreed recipient and message. The public home currently does not mount `ContactForm` or call `/api/contact`.

## Verification method and limits

1. Before the channel change, `npm run check` passed TypeScript, lint, formatting and 111 unit tests.
2. After changing the section and styles, the same checks and 111 unit tests passed again.
3. Browser coverage was updated to exercise the new public contact action instead of the removed form UI. Existing email component and route unit coverage was preserved. The real same-origin API validation browser regression also remains: invalid data must return 400 before delivery.
4. WhatsApp destination and draft are checked against the supplied number. Keyboard activation is tested by intercepting **only the external destination** with a test fixture, proving navigation without sending a real message. This does not establish the number's WhatsApp registration or receipt on a device.
5. The contact link is checked with JavaScript disabled at 320, 390, 820 and 1440 pixels. Other checks cover keyboard focus, contrast, hover/press geometry, touch navigation and reduced motion.

## Results so far

- `npm run check`: TypeScript, ESLint, Prettier and all 111 unit tests passed after each source implementation step.
- `npm run build`: passed for the final source. Next also warned about an existing `C:/Users/samue/package-lock.json` outside this checkout; it did not block compilation or server startup.
- First focused browser run: 22 passed, 4 failed, 1 skipped. Three failures still expected the removed email link and were updated to the explicitly requested WhatsApp destination. The fourth exposed the new action below the mobile anchor viewport. The layout was corrected by removing the redundant WhatsApp heading and moving alternative links below the action; the viewport assertion was preserved.
- Focused rerun: 26 passed, 1 skipped, zero failures (42.4 seconds). The skip is the existing fine-pointer hover case on mobile.
- Render inspection at 320, 390, 820 and 1440 pixels: no horizontal overflow, no page errors, action height about 54 pixels. At 390 pixels, the action occupied vertical coordinates 620–674 after loading the contact anchor with reduced motion. Desktop and mobile captures were inspected together.
- Initial full browser regression run: 200 passed, 9 profile skips, one failed main-stylesheet request causing a reduced-motion assertion failure. The unchanged failing case passed three subsequent runs. Details and preserved evidence are recorded in the intake follow-up. This was not a clean full pass.

Local screenshots and raw reports are in `.cache/contact-whatsapp/` (ignored by Git). Local verification is separate from publication; no production deployment or environment change is part of this channel change. No real email or WhatsApp message was sent, and receipt on the owner's device remains unverified.

## Repeat the checks

Run from `portfolio/`. Build before starting the local server, then keep that build unchanged during browser verification:

```powershell
npm run check
npm run build
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3400
```

In a second terminal, use the installed Edge browser or omit `PLAYWRIGHT_CHANNEL` if Playwright Chromium is installed:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3400'
$env:PLAYWRIGHT_CHANNEL = 'msedge'
node node_modules/@playwright/test/cli.js test --workers=1
```

Review the preview at `http://127.0.0.1:3400/#contato` before approving publication. The existing email configuration checker can still fail while WhatsApp works; it checks the retained email service, not this public contact link.
