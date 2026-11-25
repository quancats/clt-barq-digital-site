# Project Brief

> **Template maintainers:** Keep the live starter description in `README.md`, `docs/astro/*`, and `docs/TEMPLATE-CHANGELOG.md`. This brief is the adopting-project governance entry point (bootstrap snapshot may lag the starter).

## Project identity

Project name: Barq Digital

Project type: Static bilingual corporate and product showcase website (Astro)

Ownership: Frontend / Astro site application (`site`)

Repositories involved:

- `clt-barq-digital-site` — Barq Digital website repository

Current status: MS-001 implementation and local verification complete, pending review.

## Summary

This repository is a governed Astro 7 starter for public content websites. It ships a static, HTML-first architecture with Arabic and English as equal release targets, local Content Collections for articles, SEO helpers, sitemap/RSS, Tailwind CSS 4, and a quality toolchain (TypeScript strictest, ESLint, Prettier, Vitest, Playwright). Vue islands, CMS/API clients, and server adapters are intentionally out of the baseline and may be added only after approval.

## Business goals

- Provide a reusable, standards-aligned Astro template for informational and content-heavy public sites.
- Enforce bilingual (`ar`/`en`) routing, RTL/LTR, and SEO contracts from day one.
- Keep hydration at zero by default; allow only reviewed, budgeted progressive-enhancement scripts such as theme preference handling.
- Give teams a ready quality gate (check, lint, format, unit, e2e, CI) before feature work starts.

## Target users

- Engineering teams adopting Astro for public websites
- Content authors working with local Markdown and trusted MDX collections
- Reviewers and AI agents operating under project governance rules

## Problems solved

- Avoids starting from an ungoverned Astro minimal starter
- Removes ambiguity around folder layout, naming, locales, and SEO
- Prevents premature Vue/CMS/SSR dependency sprawl
- Makes readiness, ownership, and acceptance criteria explicit before implementation

## Core modules

- Platform / tooling baseline
- Layouts and design tokens
- Locale and dictionary system
- Content Collections (articles)
- SEO, sitemap, and RSS
- Quality and CI gates

## Out of scope

- Vue / Reka UI islands beyond the approved set in `docs/astro/ISLAND-MAP.md`
- Headless CMS or Laravel API integration
- Astro adapters / SSR / Actions
- Auth, dashboards, and authenticated shells
- Analytics SDKs and third-party marketing scripts
- Contact forms with server mutations

## Assumptions

- Sites adopting this template are primarily static and rebuild-driven.
- Arabic is the default locale; every locale is URL-prefixed (`/ar/`, `/en/`).
- Markdown remains the default; MDX is available for trusted authors when allowlisted components are needed.
- Production deployments must set the approved `PUBLIC_SITE_URL`.

## Risks

- Teams may add Vue/CMS prematurely without island/integration approval.
- Duplicate documentation trees (`docs/standards` vs `docs/01-standards`) may confuse ownership.
- Placeholder template content must not be treated as production copy.

## Success criteria

- Governance docs identify Feature IDs, milestones, ownership, and acceptance criteria.
- Canonical folder structure and tooling match Astro standards for content sites.
- Bilingual home, articles index, article detail, 404, sitemap, and RSS work as static HTML.
- `check`, lint, format, unit, build, and e2e gates pass.

## Open questions

- Canonical docs path for managed standards copies (`docs/standards` vs `docs/01-standards`) — tracked as technical debt for the central standards package.
- Exact production `PUBLIC_SITE_URL` and hosting target remain project-specific at adoption time.
