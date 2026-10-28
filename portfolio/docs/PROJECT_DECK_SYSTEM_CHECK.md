# Project deck: incumbent system check

Checked on 28 October 2026. This report documents an ordinary extension of the existing portfolio after the final bounded corrections. It does not establish a new visual system or authorize publication.

## Authority and preservation

The incumbent authorities remain [DESIGN.md](DESIGN.md) and [PRODUCT.md](PRODUCT.md). The surface-specific agreement is [PROJECT_DECK_DIRECTION.md](PROJECT_DECK_DIRECTION.md), with implementation history and approval boundaries in [PORTFOLIO_COPY_DECK_PROCESS.md](PORTFOLIO_COPY_DECK_PROCESS.md). The final disposition is [PROJECT_DECK_REVIEW.md](PROJECT_DECK_REVIEW.md).

The owner requested compatible supplied copy on the home and internal pages plus a separate experiment at `/experimentos/cards`. The home retains its accordion. The experiment leads with GreatMaker, followed by Curriculum Studio, OctoCards and LinkKeeper; this order does not replace the home order or seven-project catalog. The portfolio identity was not reopened.

This document is the documenter's only write. Existing design and product documents, code, assets and sidecars are preserved. No root `DESIGN.md` or token sidecar is created. No `.impeccable/design.json` was present in the inspected application. Preservation fingerprints before this write:

- `docs/DESIGN.md`: SHA-256 `15767F502961A6263027AF70B59394B6D54A0B071688A6A357671948D7C60394`.
- `docs/PRODUCT.md`: SHA-256 `E11BC699C314979032F85EFEABFE6A71AA216AA72F7C56285D2A0AC3902EB35F`.

## Observed system continuity

| Concern            | Evidence in finished source and captures                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Palette            | `src/styles/tokens.css` remains the source of shared values: canvas `#141414`, secondary canvas `#1b1b1b`, text `#f2f0ea`, paper `#f0eee8`, terracotta `#c94e37`, muted text `#a6a49f`. Deck styles consume existing variables, including accent state colors and hairlines. This table is evidence, not a new token definition.                                              |
| Typography         | The deck and introduction consume the established display family, with the existing body and mono families. The shared stacks remain Roboto Condensed / Arial Narrow, Lato / Helvetica Neue / Arial, and IBM Plex Mono / Courier New. The local heading scale is bounded at 2–3 rem; summaries use 16 px with 1.7 line height. No new face or global type ramp is introduced. |
| Structure          | Thin dividers and dark tonal surfaces continue the editorial/engineering direction. The card is a functional project container with a 12 px radius, an active terracotta outline and evidence beside its copy. Local card geometry is not promoted to a global rule.                                                                                                          |
| Responsive reading | Above 760 px, each card uses two content columns and restrained neighboring previews. At 760 px and below, evidence follows copy vertically and inactive neighbors are hidden. The active card determines height. At 320 px, titles and summaries wrap within the gutters.                                                                                                    |
| Interaction        | Selection has explicit previous/next buttons and numbered controls, with 48 px minimum button dimensions. Links and native disclosure summaries have 44 px minimum height. Focus styles use the existing accent state color. There is no autoplay or circular navigation.                                                                                                     |

These observations preserve the incumbent principles of selective action color, recognizable evidence, functional containers, readable mobile stacking and reduced motion. They do not add named system rules or reinterpret local surface decisions as portfolio-wide requirements.

## Bounded correction check

The four fresh full-page captures in `.impeccable/review/` were visually inspected: `desktop.png`, `mobile.png`, `narrow.png` and `tablet.png`, corresponding to 1440, 390, 320 and 760 px widths. The captures show loaded project evidence and continuous document content. At 1440×900, the complete initial GreatMaker card fits approximately between y=339 and y=828. At narrow widths, the title, substantive headline and full summary precede the fold while evidence continues in normal flow.

The experiment starts directly with “Projetos em cartas.” The shared card source places each project title before its category/maturity metadata. Desktop and narrow project captures for Curriculum Studio, OctoCards and LinkKeeper were also visually sampled from `.cache/copy-deck/deck-reviewed/`; GreatMaker was checked in the four full-page views. The additional four-project by four-width capture set is present in that directory. This document does not claim a new exhaustive visual scoring pass over every image.

The final review scores only the compact introduction/first viewport and removal/reordering of the experimental eyebrow/metadata. Both are resolved, consistent with its `ship` disposition. That disposition applies to the scored fixes and does not constitute approval for the whole portfolio or external publication.

## Functional and content evidence

`project-deck.tsx`, `project-deck.module.css`, `project-deck-visual.tsx`, `use-deck-interaction.ts`, `deck-gesture.ts` and the experiment route were inspected directly. The server-rendered ordered list contains all four projects and native links/disclosures without JavaScript. Hydration enables bounded selection and hides/inerts inactive cards. Arrow keys, Home and End select projects; an announcement reports the active selection, and focus returns to the stage when changing a card containing focus.

Pointer Events distinguish deliberate horizontal gestures from vertical scrolling. A gesture selects at most one neighbor, retains native vertical pan/pinch zoom, and handles cancellation. Links, buttons and disclosure controls do not become selection gestures; a completed drag suppresses its accidental click. Motion is dynamically imported from `motion/mini` on interaction intent. The animation duration is 0.3 seconds; reduced motion skips animation and optional module failure leaves selection functional. These are surface implementation facts, not new global motion tokens. The parent implementation records Motion 14.7.1.

The content continues to identify GreatMaker as local M1 and OctoCards as alpha with no confirmed public instance. LinkKeeper's implemented storage core is distinguished from future product features. The experiment uses curated content, and the home remains independent of GitHub fetching; catalog repository data remains a server concern. No usage metrics, seniority or commercial outcomes are invented by this check.

No shipping raster was added or replaced. [PROJECT_SOURCES.md](PROJECT_SOURCES.md) remains the provenance record: the GreatMaker image is the authentic DesignRef M1 library capture from commit `90cbf7b`, and the other deck visuals are labeled implementation diagrams. The authentic incumbent portrait is preserved. Review captures are local verification evidence rather than new product imagery.

## Existing documentation drift, left unchanged

`docs/DESIGN.md` is an incumbent prose document rather than the current portable frontmatter/section format. Its palette is intentionally less complete than the existing stylesheet: shared surface, accent-state, status and motion values are not fully inventoried there. This incompleteness predates this documentation pass; it does not authorize migration, a token rewrite or a new sidecar.

`docs/PRODUCT.md` retains an older preservation shortlist including operational automation and Design Patterns Dojo, whereas the established current home highlights Curriculum Studio, GreatMaker, OctoCards and LinkKeeper and the catalog also contains IcarusRoc, OpsCLI and Design Patterns Dojo. Current curation and source evidence are recorded in `PROJECT_SOURCES.md`. The older shortlist is reported as documentation drift, not silently rewritten or treated as a reason to change the approved content.

Not canonized or repaired: pre-existing documentation omissions and the older curation shortlist; local experiment geometry, preview ornament and motion easing are not elevated into shared design rules. No new defect hunt or global design-system revision was authorized.

## Verification limits and release boundary

The context engine, detector findings and QUALITY BAR card were unavailable. This pass used direct source/document/capture comparison and did not rerun their launcher or present that fallback as detector validation. It ran no browser, build or CPU-intensive command while the parent's loading benchmark was active.

The parent reports successful `npm run check`, 102 unit tests and production build, followed by a final Playwright report of 204 total cases: 195 expected, 0 unexpected, 0 flaky and 9 skipped. These are inherited verification results, not tests rerun by the documenter. Browser coverage is Edge/Chromium profiles; physical devices, Safari and Firefox remain outside that coverage. No benchmark result or performance improvement is asserted here.

Owner approval remains required before pushing a branch, opening a PR or deploying. This documentation pass uploads nothing and grants no such approval.
