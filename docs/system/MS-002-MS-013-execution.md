# Barq Digital v1.0 | MS-002 through MS-013

Evidence date: 2026-11-25. Repository: `clt-barq-digital-site`. Starting revision: `9af8729` on `release-v1.0/pr-sdfevnfj`.

| Milestone | State     | Evidence and handoff                                                                                                                                                                                                                                                                                              |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MS-002    | IN_REVIEW | Technical lead documented both work packages, the static architecture and the review workflow. MS-001 is locally verified and remains in review. Hosted dev and master have no active protection rules. See [architecture and engineering conventions](MS-002-architecture.md).                                   |
| MS-003    | BLOCKED   | WP-003.1 is ready for review as a public baseline. All 34 discovered internal www paths returned 200. WP-003.2 records all 27 bilingual route families and is pending accountable owner decisions. See [legacy inventory](MS-003-legacy-inventory.md) and [content governance](MS-003-route-content-register.md). |
| MS-004    | BLOCKED   | Depends on MS-002 and MS-003. The starter serves Arabic under `/ar/`. The target contract needs unprefixed Arabic, a verified counterpart for each switcher link and coverage for formatting and missing translations.                                                                                            |
| MS-005    | BLOCKED   | Depends on MS-002 and MS-003. The existing article collection is the starter baseline. The publication schemas, relationship and approval rules, and positive and negative fixtures remain due.                                                                                                                   |
| MS-006    | BLOCKED   | Depends on MS-005 and foundation review. Existing validation and manual GitHub CI definitions were inspected. The content gate and review workflow verification remain due.                                                                                                                                       |
| MS-007    | BLOCKED   | Depends on MS-003. Commit `9af8729` documents approval of the palette in issue #36. The designer and client owner still need to supply approval for the complete visual direction, type and asset rights.                                                                                                         |
| MS-008    | BLOCKED   | Depends on MS-007 and MS-003. Needs reviewed desktop and mobile page templates and four lead journeys.                                                                                                                                                                                                            |
| MS-009    | BLOCKED   | Depends on MS-007 and MS-002. Semantic tokens and the approved palette exist. Full token acceptance requires the approved type assets and a representative bilingual showcase.                                                                                                                                    |
| MS-010    | BLOCKED   | Depends on MS-009. The component catalog covers starter interactions. The approved primitive inventory and accessibility evidence for the design system remain due.                                                                                                                                               |
| MS-011    | BLOCKED   | Depends on MS-010, MS-004 and MS-003. The starter has bilingual navigation and keyboard tests. The product navigation contract requires approved destinations and labels.                                                                                                                                         |
| MS-012    | BLOCKED   | Depends on MS-008, MS-010 and MS-004. Starter layouts exist. Representative corporate, legal, and commercial section fixtures require the approved layouts and route and component contracts.                                                                                                                     |
| MS-013    | BLOCKED   | Depends on MS-011 and MS-012. Baseline checks cover the starter. Design-system verification and sign-off require the integrated templates and navigation.                                                                                                                                                         |

The execution plan §5.1 allows early discovery and drafting. The entries above record existing implementation where it provides a starting point for dependent work. No application source or deployment configuration changed in this pass.

## Local verification

- `pnpm run validate` passed with the pinned pnpm 10.32.1 from the existing Corepack cache. Astro checked 162 files with zero errors or warnings. Vitest passed 64 tests in 17 files.
- The Astro static build generated 12 HTML pages. Artifact checks passed the configured local performance budgets, found zero broken internal links and verified preview indexing policy. The header used 87,588 gzip bytes, above the plan's proposed under-50 KB target for suitable pages.
- `pnpm run verify:e2e` passed all 64 Chromium tests after enabling access to the local preview server. The suite covered the existing bilingual starter, including keyboard navigation and automated accessibility checks.
- Hosted CI execution remains unverified. GitHub returned no active branch protection or rules on `dev` and `master` in the project repository. See [MS-002 review evidence](MS-002-architecture.md).

## Preparation while dependencies are open

- [MS-007 visual directions and rights record](MS-007-brand-direction-draft.md) compares three directions and records the provenance and approval status of the current palette, fonts and assets.
- [MS-008 responsive wireframes](MS-008-wireframes-draft.md) covers all 27 page IDs, both directions and four lead journeys.
- [MS-004–013 engineering preparation](MS-004-MS-013-preparation.md) records the draft route and publication contracts, validation changes and the existing versus required design-system test evidence.
