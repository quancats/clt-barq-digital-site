# Barq Digital v1.0 | MS-002 through MS-013

Evidence date: 2026-11-25. Repository: `clt-barq-digital-site`. Starting revision: `9af8729` on `release-v1.0/pr-sdfevnfj`.

| Milestone | State       | Evidence and handoff                                                                                                                                                                                                                                                          |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MS-002    | ACCEPTED    | The user accepted MS-001 and MS-002 on 2026-11-25. See [architecture and engineering conventions](MS-002-architecture.md).                                                                                                                                                    |
| MS-003    | ACCEPTED    | The user accepted the public baseline, corporate positioning and the services and solutions taxonomy on 2026-11-25. [Legacy inventory](MS-003-legacy-inventory.md) and [content governance](MS-003-route-content-register.md) retain the item-level publication restrictions. |
| MS-004    | IN_REVIEW   | Arabic moved to the root and English stays at `/en/`. Static builds and browser checks cover the locale contract, and missing translations have an explicit unavailable state. Cloudflare behavior remains for host verification.                                             |
| MS-005    | IN_REVIEW   | Eleven schema-backed collections, publication validation, approved-only queries and synthetic integration evidence in the [publication contract](MS-005-content-publication.md).                                                                                              |
| MS-006    | ACCEPTED    | Accepted with the user-approved hosted CI exception on 2026-11-26. Local validation passed and GitHub checks are configured for PRs to `dev` and `master`. The hosted workflow did not run on the local changes.                                                              |
| MS-007    | IN_PROGRESS | The user approved the enterprise editorial direction on 2026-11-25. Palette evidence is in `9af8729`. The user approved the source logo and IBM Plex Sans Arabic on 2026-11-26. Remaining asset rights are tracked in the visual record.                                      |
| MS-008    | ACCEPTED    | The user approved the bilingual wireframes and four lead journeys on 2026-11-26. See [responsive wireframes](MS-008-wireframes-draft.md). Implementation verification continues in MS-010–013.                                                                                |
| MS-009    | IN_PROGRESS | Semantic layout and typography tokens, a contrast fix and a bilingual component preview exist. Both languages use the approved local IBM Plex Sans Arabic family.                                                                                                             |
| MS-010    | IN_PROGRESS | Native section, grid, stack, button, field, disclosure and status primitives render in both directions without JavaScript. The final component inventory and assistive technology review remain due.                                                                          |
| MS-011    | IN_PROGRESS | Production uses static navigation, genuine alternate links and a native theme picker. It suppresses links to empty and preview-only destinations. Product navigation, verified corporate links and lead CTAs need approved destinations.                                      |
| MS-012    | IN_REVIEW   | Shared layouts and sections render corporate, commercial and legal development fixtures in both languages. The fixture matrix passed at 320, 768 and 1440 px. Unapproved images and empty credentials sections stay absent.                                                   |
| MS-013    | ACCEPTED    | Accepted with the user-approved exceptions for audible screen-reader testing and separate designer and technical lead sign-off on 2026-11-26. The six integrated fixtures passed responsive, automated accessibility, accessibility-tree and keyboard checks.                 |

## Local verification

- `pnpm run validate` passed Prettier, ESLint, Astro and Vue type checks and 72 Vitest tests. Astro reported zero diagnostics across 185 files and logged missing-file warnings for the ten empty collections. The focused content script passed all six publication tests.
- The local preview build generated 12 HTML pages without broken links or isolated pages. The existing budgets and preview indexing checks passed. Chromium passed 64 tests including RTL/LTR navigation and automated accessibility.
- A production-profile build used a test origin and no deployment. Its four HTML files were the Arabic and English homes and two error pages. The sitemap contained two home URLs and the RSS feed contained no fixture entries. Preview routes and preview-only fonts were absent. A subsequent brand update added the approved Arabic font and logo derivatives to production output, while keeping the temporary sharing image preview-only. Vite still emitted unreferenced catalog code chunks. The four-page artifact is a technical check before later page milestones.
- An isolated production-profile build with a synthetic approved bilingual article pair generated both localized slugs, reciprocal alternates and two RSS items. Separate negative runs failed on duplicate identifiers, a missing required locale, an invalid relationship and a missing asset.
- The component preview lives at `/design-preview/arabic/` and `/design-preview/english/` in Astro development. The static build omits both routes and the legal fixture under each locale. The legal fixtures returned HTTP 200 with a localized effective date and noindex in development. Confirmed keyboard disclosure, native field semantics, responsive flow and automated accessibility in both directions. Manual assistive-technology checking and separate sign-off are covered by the user-approved exceptions recorded below.
- The production-profile Arabic and English homes each loaded 3,135 bytes of local JavaScript after gzip in Chromium, including executable inline scripts. Both passed the proposed under-50 KB threshold. Vue-based catalog navigation remains available in preview. Recheck the budget on later representative pages.

## Integrated template review on 2026-11-26

- Tested corporate, commercial and legal development previews in Arabic and English, at 320, 768 and 1440 px. Verified singular H1, ordered heading levels, skip-link keyboard focus and same-template locale navigation with JavaScript disabled. None overflowed horizontally.
- Inspected the accessibility tree in Chromium and ran axe rules for WCAG 2 A, AA and 2.1 AA. All six fixtures passed. This evidence covers browser-exposed semantics. Audible Windows Narrator or NVDA behavior was untested. The user waived that check and the separate designer and technical lead sign-off for this checkpoint.
- Every fixture returned noindex. Corporate and commercial fixtures omit unapproved media and empty credentials sections. The static build excludes all development fixtures. No hosted checks ran on this working tree.

## User-approved acceptance exceptions

On 2026-11-26 the user directed the team to skip the audible screen-reader check, separate designer and technical lead sign-off, and the hosted CI run. MS-006 and MS-013 are recorded as accepted with those exceptions on the strength of the completed local checks. The exceptions do not extend to asset rights, later release gates or authorization to push, merge or deploy.

## Design and engineering records

- [Visual directions and rights record](MS-007-brand-direction-draft.md) records the selected visual approach and the owners' outstanding asset decisions.
- [Bilingual responsive wireframes](MS-008-wireframes-draft.md) describes navigation and all four lead journeys.
- [Engineering preparation](MS-004-MS-013-preparation.md) records the preceding contract drafts and the design-system verification matrix.
