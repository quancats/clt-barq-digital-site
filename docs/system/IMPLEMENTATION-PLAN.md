# Implementation Plan

> **Template maintainers:** Starter milestones and Feature IDs live in [`docs/astro/FEATURE-BASELINE.md`](../astro/FEATURE-BASELINE.md). Do not append template-maintainer milestones here.

## Purpose

This file breaks the project into phases and reviewable milestones.

## Rules

- No broad milestones like "build dashboard".
- Every milestone must be reviewable.
- Every milestone must link to Feature IDs.
- Every milestone must state affected repositories.
- Every milestone must include documentation updates.
- Every milestone must include tests.

## Milestones

### MS-001 — Platform baseline and bilingual shell

Goal: Make the repository a governed static Astro content template with tooling, structure, layouts, i18n shell, and SEO helpers.

Repositories involved: astro-template

Applications involved: site

Related Feature IDs: FEAT-PLATFORM-001

Related domains: Platform, LocaleSeo

Related data: site_config, ui_dictionaries

Related APIs: None

Related flows: FLOW-LOCALE-001, FLOW-NAV-001

Backend scope: None

Frontend scope:

- Toolchain and configs
- Canonical `src/` folders used by baseline
- Layouts, header/footer, language switcher
- Home routes for `ar`/`en`
- SEO helpers, sitemap, robots
- Unit/e2e smoke coverage and CI

Admin/CMS scope: None

Tasks:

1. Fill governance and Astro maps
2. Install baseline dependencies and scripts
3. Create structure, styles, layouts, and shell components
4. Wire i18n routing and home pages
5. Add SEO helpers/sitemap/robots
6. Add tests and CI
7. Update docs/changelog
8. Align static components with the canonical `components/astro/{layout,sections,content}` taxonomy

Acceptance criteria:

- Governance blockers removed for this template scope
- `npm run check`, lint, format check, test, build succeed
- `/ar/` and `/en/` render static HTML with correct `lang`/`dir`
- No Vue/adapter/CMS packages present

Tests required:

- Locale/SEO unit tests
- Playwright home/navigation/404 checks
- CI workflow green locally equivalent commands

Documentation updates required:

- system docs, `docs/astro/*`, README, changelog

Risks: Installing optional packages early

Dependencies: None

Files expected:

- `astro.config.ts`, toolchain configs, layouts, i18n, SEO helpers, CI workflow

Definition of done:

- Feature acceptance criteria met and docs updated

### MS-002 — Local bilingual articles and feeds

Goal: Ship local Content Collections for articles with list/detail routes and RSS.

Repositories involved: astro-template

Applications involved: site

Related Feature IDs: FEAT-CONTENT-001

Related domains: Content, LocaleSeo

Related data: articles

Related APIs: None

Related flows: FLOW-CONTENT-001

Backend scope: None

Frontend scope:

- `content.config.ts` and sample articles
- Content queries/mappers
- Articles index and detail pages
- RSS endpoint
- Content-focused tests

Admin/CMS scope: None

Tasks:

1. Define article schema and fixtures
2. Implement queries and content components
3. Add localized article routes
4. Add RSS
5. Extend tests and docs

Acceptance criteria:

- Published bilingual articles render on list/detail routes
- Drafts excluded from HTML, sitemap, and RSS
- Language switcher resolves translated article when present
- Content schema failures break the build

Tests required:

- Draft/translation helper tests
- Playwright article and RSS checks

Documentation updates required:

- Feature registry status, content ownership map, changelog

Risks: Incomplete translation pairs

Dependencies: MS-001

Files expected:

- `src/content/**`, article pages, RSS route, content tests

Definition of done:

- Feature acceptance criteria met and docs updated

### MS-003 — Theme preference and standards alignment

Goal: Add accessible light/dark/auto theming and align the static component taxonomy with current managed Astro standards.

Repositories involved: astro-template

Applications involved: site

Related Feature IDs: FEAT-PLATFORM-001, FEAT-CONTENT-001

Related domains: Platform, Content, LocaleSeo

Related data: site_config, ui_dictionaries, articles

Related APIs: Browser `localStorage` and `matchMedia` only

Frontend scope:

- Pre-paint theme resolution and Light/Dark/Auto selector
- Semantic light/dark tokens and localized labels
- Canonical `components/astro/{layout,sections,content}` placement
- CI enforcement for MDX component imports

Tasks:

1. Add typed default-theme configuration
2. Implement and test theme initialization and persistence
3. Migrate static components to the canonical Astro taxonomy
4. Enforce trusted MDX imports in CI
5. Synchronize system and Astro maps

Acceptance criteria:

- Theme applies before first paint and persists valid visitor choices
- No hydrated island or Vue dependency is introduced
- Static components live under `components/astro`
- Every repository MDX import is allowlisted
- Quality gates and browser tests pass

Status: Done

### MS-004 — Bilingual shadcn-vue component catalog

Goal: Ship a public bilingual component catalog that demos reviewed shadcn-vue primitives through one cohesive Vue island.

Repositories involved: astro-template

Applications involved: site

Related Feature IDs: FEAT-PLATFORM-002

Related domains: Platform, LocaleSeo

Related data: ui_dictionaries, ui_component_registry

Related APIs: None

Frontend scope:

- Vue 3 + `@astrojs/vue` + project-owned shadcn-vue primitives
- `/ar/components/` and `/en/components/` catalog routes
- Header navigation link and mirrored dictionaries
- Catalog island demos (local-only forms, overlays, carousel, feedback)
- Quality gates: vue-tsc, unit/e2e/a11y, performance budget update

Tasks:

1. Approve feature/ADR and dependency register updates
2. Install Vue/shadcn stack and map design tokens
3. Add UI primitives and catalog registry
4. Build bilingual catalog pages and navigation
5. Add tests and documentation maps

Acceptance criteria:

- Both locale catalog routes render and are indexable
- All 31 approved components appear with working demos
- No real form/API submission from demos
- Catalog island budget documented; other routes stay island-free
- Quality gates pass including vue-tsc and Playwright accessibility checks

Status: Done
