# OctoCards refresh and PR verification — 28 October 2026

Resumed and completed local measurement/review on 29 October 2026. The saved final browser report was verified before resuming; the upstream OctoCards head and portfolio main were checked again and had not changed.

## Authorization and boundaries

The owner authorized a portfolio PR after fresh performance checks, verification of OctoCards changes on GitHub, and tests at each stage. This supersedes the previous upload hold once those gates pass. It does not authorize merging the PR or promoting production. The isolated portfolio branch remains `codex/portfolio-copy-deck-experiment-20261026`; unrelated local applications remain untouched.

## Stage gates

1. Baseline: clean local commits `9cdefaf` and `8f59262`; fresh portfolio check passed 102 unit tests, typecheck, lint and formatting. Three cold visits per desktop/mobile viewport measured the unchanged production build before edits; evidence `.cache/copy-deck/deck-before-octo/measurements.json`.
2. Upstream verification: OctoCards main `b467160150a140bc1f6d19bc99f88fc0b4070333`, 19 commits beyond the previous pinned source. Read immutable code, not just README/audit claims. GitHub Backend CI and CodeQL succeeded; seven issues #8–#14 remain open.
3. Upstream execution: fresh isolated checkout of that SHA; lockfile install, unchanged complete `npm test` passed 5 suites/33 tests, TypeScript check passed, `npm run test:build` passed compiled build and HTTP smoke, production audit returned zero vulnerabilities. Full audit returned exit 1 and seven low development alerts in the Jest/deepmerge chain. No overrides, test exclusions or upstream edits were made. The empty legacy suite was already removed by upstream commit `12ab4bc`.
4. Portfolio content: corrected stale limits/test claims and immutable references; retained alpha/public-instance boundaries. Added verified runtime/build/CI milestones and all seven unresolved audit issues. Existing task IDs retained; 16/25 leaves complete, a task count rather than a readiness claim. Focused tests passed 29 cases after content edits, then 19 cases after refreshing only the OctoCards fallback record.
5. Final application checks and production build passed: typecheck, lint, formatting and 103 unit tests. The complete saved browser report contains 204 cases: 195 passed, 9 pre-existing profile-specific skips, zero unexpected results and zero flaky results. New browser assertions verify the pinned commit, an open audit issue and the refreshed README configuration text. No browser suite ran while its build was regenerated.
6. Final cold-load performance passed all fixed gates: 24 visits across four routes/two viewports, no page/HTTP errors. No build, tests or dependency installation ran concurrently. The optional Motion import was separately measured at 5,186transfer bytes, with no scroll; animation properties progressed and no animations remained at the325ms sample.
7. Local diff review and security gates passed after gates 5–6: staged changes and the existing76-commit history had no scanner findings. The complete check was repeated on29October and passed103 unit tests, types, lint and formatting. Push/PR are owner-authorized after these results; hosted CI and any preview results are recorded separately. No production merge is authorized.

## Performance method and acceptance

Use `node scripts/review-copy-deck.mjs deck-octo-final --include-projects` against local production at port 3400. Three cold visits for each of 1440×900 and 390×844; CPU4×,150ms latency,200000B/s download, observe load plus3s without input. Cover home, experiment, catalog and OctoCards detail. Inspect errors, initial JavaScript, LCP, observed layout shifts, HTML/total transfer and long-task excess.

Before measuring final results, use explicit review limits: no page/HTTP errors; median LCP under2500ms and no more than500ms slower than the before-edit home/deck medians; observed CLS at most0.1 per visit; initial JS increase under5000transfer bytes for home/deck. Record every sample and any failed gate, without silently replacing a result. Long-task excess is diagnostic during the fixed observation window, not Lighthouse TBT, field INP or a real-device guarantee.

Interaction verification preserves the complete existing browser assertions: deferred Motion, reduced motion, real touch, vertical scrolling, bounded selection, CTA drag/click distinction, cancellation, focus, no-JS reading, rapid interruptions and removal of final inline animation styles. The optional Motion chunk is measured separately with focus that prevents scrolling.

## Final lab results

| Route             | Median LCP desktop / mobile | Initial JS transfer | Maximum observed CLS desktop / mobile |
| ----------------- | --------------------------- | ------------------- | ------------------------------------- |
| Home              | 1,264 / 1,184ms             | 149,365bytes        | 0 / 0                                 |
| Experimental deck | 1,220 / 1,156ms             | 149,789bytes        | 0.0343 / 0.0683                       |
| Catalog           | 832 / 828ms                 | 139,815bytes        | 0 / 0                                 |
| OctoCards detail  | 904 / 824ms                 | 141,970bytes        | 0 / 0                                 |

Home LCP medians increased140/192ms compared with the before-edit lab samples; deck medians increased52/72ms. Those differences remain within the predeclared500ms review bound and are not evidence of a real-user performance improvement. Initial JS changed by zero bytes on home/deck. The detail page made two prefetch requests; home/deck made none. Long-task excess under CPU4× is retained in the raw report and is not labeled Lighthouse TBT or field INP.

The committed [raw evidence](verification/octocards-performance-2026-10-29.json) contains all12 before-edit samples, all24 final samples, browser version/time, unchanged acceptance limits, computed deltas and interaction frames. The existing script now saves partial measurements on failure as well. No sample was discarded or replaced in this final measurement run.

## Remaining upstream limitations

No public OctoCards API origin has been supplied or verified. The portfolio continues fetching public GitHub data server-side and validating it, with local fallback. No client credentials or browser GitHub requests are introduced. Retries and multi-process budgets remain open. The upstream development advisory is reported explicitly and does not affect the portfolio dependency lockfile.

Physical devices, Safari, Firefox and real-user field performance are outside this local Chromium/Edge coverage. No public contact/PDF submission or production mutation is part of this verification.
