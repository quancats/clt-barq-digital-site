# Feature Registry

## Purpose

Central register for every feature in the **adopting project**.

> **Template maintainers:** Do not evolve the starter here. Current template Feature IDs, milestones, and acceptance notes live in [`docs/astro/FEATURE-BASELINE.md`](../astro/FEATURE-BASELINE.md). The rows below are the bootstrap snapshot shipped with the template for adopters to replace or extend.

## Feature ID format

Use:

```text
FEAT-[DOMAIN]-[NUMBER]
```

## Registry

| Feature ID        | Feature                         | Domain               | Owner app | Status | Milestone | Related APIs | Related data                           | Notes                                          |
| ----------------- | ------------------------------- | -------------------- | --------- | ------ | --------- | ------------ | -------------------------------------- | ---------------------------------------------- |
| FEAT-PLATFORM-001 | Astro content template baseline | Platform / LocaleSeo | site      | Done   | MS-001    | None         | site_config, ui_dictionaries           | Tooling, structure, layouts, SEO shell         |
| FEAT-CONTENT-001  | Local bilingual articles        | Content / LocaleSeo  | site      | Done   | MS-002    | None         | articles                               | Content Collections + article routes           |
| FEAT-PLATFORM-002 | Bilingual shadcn-vue catalog    | Platform / LocaleSeo | site      | Done   | MS-004    | None         | ui_dictionaries, ui_component_registry | Public `/components` showcase with Vue islands |

## Feature template

### FEAT-PLATFORM-001 — Astro content template baseline

Description: Establish the governed static Astro template with bilingual shell, tooling, SEO helpers, and quality gates.

User roles: Engineer, Reviewer / AI agent, Site visitor

Domain owner: Platform (shared LocaleSeo)

Application owner: site

Related repositories: astro-template

Related data: site_config, ui_dictionaries

Related APIs: None

Related UI: Base/Website layouts, header, footer, language switcher, theme switcher, home pages

Permissions: Public read-only

Jobs/events/listeners: None

Acceptance criteria:

- Astro 7 static project with TypeScript strictest, Tailwind 4, ESLint, Prettier, Vitest, Playwright
- Canonical folders and descriptive PascalCase component names without layer prefixes
- `/` redirects/selects into default locale; `/ar/` and `/en/` render with correct `lang`/`dir`
- SEO helpers emit title, description, canonical, alternates, and Open Graph
- Sitemap and robots exist; quality scripts and CI pass
- Light, dark, and auto themes apply before first paint and persist the visitor preference
- Theme preference persists; pre-paint bootstrap remains a non-island script in `BaseLayout`
- CMS clients and adapters are not installed; approved Vue islands are listed in `docs/astro/ISLAND-MAP.md` / `docs/astro/FEATURE-BASELINE.md`

Testing expectations:

- Unit tests for locale/SEO helpers
- Unit tests for theme resolution
- E2E for home, language attributes, navigation, theme persistence, 404 metadata
- `astro check`, lint, format check, build

Status: Done

Risks: Scope creep into additional Vue islands or CMS before approval

### FEAT-CONTENT-001 — Local bilingual articles

Description: Local Markdown/MDX article collection with bilingual list/detail routes, draft exclusion, translation linkage, and RSS.

User roles: Site visitor, Content author, Engineer

Domain owner: Content (shared LocaleSeo)

Application owner: site

Related repositories: astro-template

Related data: articles

Related APIs: None

Related UI: Articles index, article cards, article detail/content layout

Permissions: Public read-only for published entries

Jobs/events/listeners: None

Acceptance criteria:

- `articles` collection schema validates locale, translation group, title, description, dates, draft, optional image
- Published articles appear under `/ar/articles/` and `/en/articles/`
- Detail routes use localized slugs and reciprocal language switching when a translation exists
- Drafts are excluded from routes, sitemap, and RSS
- RSS feed lists published articles
- MDX is limited to trusted authors and allowlisted Astro component imports enforced in CI
- Sample template content is clearly fixture content

Testing expectations:

- Unit/content tests for draft exclusion, translation helpers, and MDX import policy
- E2E for articles index, detail, language switch, RSS

Status: Done

Risks: Treating fixture articles as production copy

### FEAT-PLATFORM-002 — Bilingual shadcn-vue component catalog

Description: Public bilingual catalog that demos reviewed project-owned shadcn-vue UI Primitives on `/ar/components/` and `/en/components/` through one cohesive Vue island.

User roles: Engineer, Reviewer / AI agent, Site visitor

Domain owner: Platform (shared LocaleSeo)

Application owner: site

Related repositories: astro-template

Related data: ui_dictionaries, ui_component_registry

Related APIs: None

Related UI: Components catalog page, SiteHeader nav link, `components/ui/*`, `ComponentCatalog` island

Permissions: Public read-only

Jobs/events/listeners: None

Acceptance criteria:

- `/ar/components/` and `/en/components/` render with correct `lang`/`dir`, canonical, and reciprocal hreflang
- Catalog includes all approved showcase primitives (31) from a typed registry
- Demo Form/Field/Input/Select/Number Field/Stepper are local-only (no HTTP submission)
- One cohesive catalog island uses `client:idle`; other public routes remain without Vue islands
- Catalog works in RTL and LTR, light/dark/auto themes, and passes axe checks
- Vue, Reka UI, and related UI packages are registered and justified by ADR-0008

Testing expectations:

- Unit test for registry completeness
- `vue-tsc --noEmit`
- Playwright coverage for catalog routes, language switch, representative interactions, and accessibility
- `astro check`, lint, format check, build

Status: Done

Risks: Catalog JS budget growth; treating demos as production product UI
