# Product Scope

## Purpose

This document defines product scope for the **adopting project**.

> **Template maintainers:** Update starter scope in [`docs/astro/`](../astro/) and [`docs/TEMPLATE-CHANGELOG.md`](../TEMPLATE-CHANGELOG.md). Do not treat this file as the live template changelog.

## User roles

| Role                | Description                          | Main goals                                                  | Notes                       |
| ------------------- | ------------------------------------ | ----------------------------------------------------------- | --------------------------- |
| Site visitor        | Public bilingual reader              | Browse home and articles, switch language, discover content | No account                  |
| Content author      | Edits local Markdown/MDX collections | Publish articles with validated frontmatter                 | Trusted repository workflow |
| Engineer            | Adopts and extends the template      | Keep structure, SEO, and quality gates intact               | Follows Feature IDs         |
| Reviewer / AI agent | Validates readiness and PRs          | Enforce standards and ownership                             | No invented APIs/CMS        |

## Functional scope

| Area     | Included features                                                                              | Excluded features                       | Notes                                                           |
| -------- | ---------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------- |
| Platform | Astro 7 static baseline, Tailwind 4, TypeScript, lint/format/test/CI                           | SSR adapter, Actions                    | FEAT-PLATFORM-001                                               |
| Locales  | `ar`/`en`, prefixed routes, dictionaries, language switcher                                    | Additional locales until approved       | Equal release targets                                           |
| Content  | Local articles Content Collection (Markdown + MDX), list + detail routes                       | CMS loaders, live collections           | FEAT-CONTENT-001                                                |
| SEO      | Titles, descriptions, canonical, hreflang, OG, sitemap, RSS, robots                            | Fabricated structured claims            | Static HTML only                                                |
| UI       | Layouts, header/footer, theme control, article cards, tokens/styles, public shadcn-vue catalog | Broader product design-system app shell | See `docs/astro/FEATURE-BASELINE.md` for starter UI Feature IDs |

## Non-functional scope

- Performance: HTML-first; only reviewed, budgeted islands/scripts per `docs/astro/PERFORMANCE-BUDGET.md`; static HTML for SEO-critical content
- Reliability: production build fails on invalid required content schemas
- Security: no secrets in client code; no remote CMS in baseline
- Privacy: no analytics scripts in baseline
- Localization: Arabic RTL and English LTR as equal targets
- Accessibility: landmarks, skip link, keyboard-capable language switcher links
- SEO: unique metadata, reciprocal alternates, sitemap/RSS
- Scalability: rebuild-driven content growth via collections

## MVP scope

1. Governance docs with Feature IDs and milestones
2. Tooling baseline and scripts
3. Canonical `src/` structure for a content site
4. Bilingual routes for home, articles, article detail, and 404
5. SEO helpers, sitemap, RSS, robots
6. Unit and e2e coverage plus CI workflow
7. Adoption-oriented README and Astro maps
8. Public bilingual shadcn-vue component catalog

## Later scope

- Additional Vue islands beyond the approved starter set after island approval checklist
- CMS/API loaders and contracts
- Server adapter / Actions for forms
- Analytics with consent design
- Additional locales

## Acceptance at product level

- A new engineer can install, run, check, test, and build the template without undocumented steps.
- `/ar/` and `/en/` render with correct `lang` and `dir`.
- Article collection schemas reject invalid content at build time.
- Draft articles are excluded from production routes, sitemap, and RSS.
- Vue runtime is limited to islands approved in `docs/astro/ISLAND-MAP.md`.
