# Decisions Log

## Purpose

Document important product, architecture, database, workflow, and delivery decisions for the **adopting project**.

> **Namespace:** Adopting projects continue to use `ADR-####` here. Template starter decisions going forward use `TADR-####` in [`docs/astro/DECISIONS.md`](../astro/DECISIONS.md) (historical template entries keep `ADR-0009`–`ADR-0021`). Index: [`docs/astro/DECISIONS-INDEX.md`](../astro/DECISIONS-INDEX.md).
>
> **Template maintainers:** New starter decisions belong in [`docs/astro/DECISIONS.md`](../astro/DECISIONS.md). ADR-0001–ADR-0008 below are the bootstrap snapshot shipped with the template.

## ADR format

### ADR-0001 — Use Astro static site for the content template

Date: 2026-07-25

Status: Accepted

Context: The repository is a reusable template for informational and content-heavy public websites. Most routes can be prerendered HTML with no shared client state.

Decision: Astro 7 with static output is the baseline architecture. Prefer Nuxt only if a future product becomes an authenticated application shell.

Alternatives considered:

- Nuxt informational site
- Astro with SSR adapter by default

Consequences:

- Zero JS by default
- Adapter/Actions require a later ADR
- CMS freshness is rebuild-driven if introduced later

Affected docs: PROJECT-BRIEF, SYSTEM-ARCHITECTURE, ASTRO suitability verdict

Affected repositories: astro-template

Follow-up: None for baseline

### ADR-0002 — Bilingual prefixed locales with Arabic default

Date: 2026-07-25

Status: Accepted

Context: Organization Astro standards treat Arabic and English as equal release targets.

Decision:

- Locales: `ar`, `en`
- Default locale: `ar`
- Prefix every locale
- Literal folders `src/pages/ar` and `src/pages/en`
- Directions: `ar=rtl`, `en=ltr`
- Cloudflare Workers Static Assets redirects `/` using the build-generated `_redirects`. Astro keeps `redirectToDefaultLocale: false`

Alternatives considered:

- English-only starter
- Unprefixed default locale

Consequences:

- Root `/` redirects to default locale
- Dictionaries and content must ship for both locales

Affected docs: I18N map, route map

Affected repositories: astro-template

Follow-up: Additional locales require a new ADR

### ADR-0003 — Local Content Collections; no CMS/Vue/MDX in baseline

Date: 2026-07-25

Status: Superseded

Context: The plan targets a content-site template without premature integration cost.

Decision:

- Articles use local Markdown Content Collections
- Install `@astrojs/sitemap` and `@astrojs/rss`
- Do not install Vue, Reka, MDX, CMS SDKs, or adapters in baseline

Alternatives considered:

- Full CMS-ready client layer
- MDX by default
- Preinstalled Vue islands

Consequences:

- Faster, smaller baseline
- Future CMS/Vue/MDX work needs dependency proposals and docs updates

Affected docs: FEATURE-REGISTRY, DEPENDENCY register, TECHNICAL-DEBT

Affected repositories: astro-template

Follow-up: Superseded for MDX by ADR-0005; Vue/CMS/adapters remain out of baseline

### ADR-0005 — Enable MDX for trusted article authoring

Date: 2026-07-25

Status: Accepted

Context: Content authors need optional component composition inside articles while keeping Markdown as the default.

Decision:

- Install and configure `@astrojs/mdx`
- Allow `.mdx` entries in the `articles` Content Collection alongside `.md`
- Restrict MDX component imports to an allowlist starting with `src/components/astro/content/Callout.astro`
- Prefer plain Markdown when components are unnecessary
- Do not introduce Vue islands through MDX

Alternatives considered:

- Keep Markdown-only authoring
- Unrestricted component imports in MDX

Consequences:

- Richer article composition for trusted repository authors
- Slightly larger dependency surface
- Allowlist must be reviewed when new MDX components are added

Affected docs: DEPENDENCY-REGISTER, CONTENT-OWNERSHIP, README, PRODUCT-SCOPE, COMPONENT-MAP

Affected repositories: astro-template

Follow-up: Expand `mdxAllowlist` only after content/component review

### ADR-0004 — TypeScript strictest and quality toolchain required

Date: 2026-07-25

Status: Accepted

Context: Managed standards require strictest TypeScript, ESLint, Prettier, Vitest, and Playwright.

Decision: Ship those tools and scripts in the template; CI runs format/lint/check/unit/build/e2e.

Alternatives considered: Minimal starter with no quality gates

Consequences: Slightly heavier `package.json`, stronger adoption guarantees

Affected docs: TESTING standard adoption via project scripts

Affected repositories: astro-template

Follow-up: None

### ADR-0006 — Light / Dark / Auto theme with class-based Tailwind dark mode

Date: 2026-07-25

Status: Accepted

Context: The template needs equal support for light and dark surfaces, plus system preference, without introducing Vue or a client state library.

Decision:

- Support modes `light`, `dark`, and `auto`
- Default mode is `auto`, configured in Astro via `env.schema` as `PUBLIC_DEFAULT_THEME`
- Apply resolved theme with the `dark` class on `<html>` before first paint
- Use Tailwind CSS 4 `@custom-variant dark` so `dark:` utilities follow the class strategy
- Persist visitor choice in `localStorage` under `site-theme`
- Implement switching with a small Astro script, not Vue

Alternatives considered:

- Media-query-only dark mode without user control
- Vue-powered theme store
- Cookie-based persistence

Consequences:

- Tiny progressive-enhancement script is allowed for theme init/switch
- Semantic CSS tokens must define both light and dark values
- Images/logos should be verified in both themes when brand assets are added

Affected docs: README, COMPONENT-MAP, PERFORMANCE-BUDGET, SYSTEM-ARCHITECTURE, TEMPLATE-CHANGELOG

Affected repositories: astro-template

Follow-up: None for baseline

### ADR-0007 — Align static components with the canonical Astro taxonomy

Date: 2026-07-26

Status: Accepted

Context: The managed structure standard now reserves `components/ui` for reviewed Vue/shadcn-vue primitives and places components without Client State under `components/astro`.

Decision:

- Move static shell components to `src/components/astro/layout`
- Move static home sections to `src/components/astro/sections/home`
- Move article and text presentation components to `src/components/astro/content`
- Use descriptive PascalCase component names; responsibility is expressed by the canonical folder taxonomy instead of filename prefixes
- Keep Vue, shadcn-vue, and Reka UI absent until a justified island or interactive primitive is approved

Alternatives considered:

- Keep the legacy `components/app`, `components/content`, prefixed filenames, and Astro files in `components/ui`
- Install the full optional Vue UI stack without a runtime requirement

Consequences:

- Static runtime boundaries are explicit in paths
- `components/ui`, `components/patterns`, and `components/islands` remain optional and are created only when used
- MDX allowlist paths and component maps must track the new locations

Affected docs: COMPONENT-MAP, SCREEN-MAP, DEPENDENCY-REGISTER, README, TEMPLATE-CHANGELOG

Affected repositories: astro-template

Follow-up: Superseded for catalog Vue adoption by ADR-0008; keep non-catalog routes island-free

### ADR-0008 — Adopt Vue 3 + shadcn-vue for the public component catalog

Date: 2026-07-26

Status: Accepted

Context: The template needs a governed public showcase of interactive UI primitives. Managed standards prefer project-owned shadcn-vue source on Reka UI over installing Nuxt UI.

Decision:

- Install `@astrojs/vue`, Vue 3, and reviewed shadcn-vue primitives under `src/components/ui`
- Expose demos on public bilingual routes `/ar/components/` and `/en/components/`
- Hydrate one cohesive catalog island with `client:idle`
- Keep Form demos local-only (no HTTP endpoint)
- Keep non-catalog informational routes free of Vue islands
- Map shadcn CSS variables onto the existing semantic theme tokens

Alternatives considered:

- Static Astro-only mockups without interactive primitives
- Nuxt UI as a permanent dependency
- Separate hydrated root per component demo

Consequences:

- Catalog route carries a larger client JS budget than baseline pages
- CI must run `vue-tsc`
- Dependency register and island map must stay current with approved primitives

Affected docs: FEATURE-REGISTRY, IMPLEMENTATION-PLAN, PRODUCT-SCOPE, DEPENDENCY-REGISTER, COMPONENT-MAP, ISLAND-MAP, PERFORMANCE-BUDGET, TEMPLATE-CHANGELOG

Affected repositories: astro-template

Follow-up: Do not expand Vue usage beyond catalog/approved islands without a new ADR

### ADR-0009 — Keep the Barq Digital website static in one repository

Date: 2026-11-25

Status: Accepted by the user on 2026-11-25

Context: v1.0 REQ-002 and WP-002.1 build on the verified working MS-001 starter. The website showcases the external BIM product and owns only website content and lead integration.

Decision:

- Use Astro SSG, TypeScript strictest and Tailwind 4. Keep Astro components as the default and Vue at explicitly reviewed interaction boundaries.
- Use local build-time Content Collections and typed UI dictionaries. Prefer Markdown and allow trusted MDX only through the reviewed component allowlist.
- Keep project code, local content and operational records in the website repository. Exclude a database, custom CMS, general API backend and separate contract repository.

Consequences: Editorial content changes are reviewed and rebuilt. The repository can produce public HTML without a content service. Existing sample routes and fixtures require publication review. The launch locale contract will be implemented separately in MS-004.

### ADR-0010 — Target Cloudflare static hosting with a limited lead Worker

Date: 2026-11-25

Status: Accepted by the user on 2026-11-25

Context: v1.0 REQ-002 and WP-002.1 require static hosting and a narrow form-processing runtime for future lead work.

Decision: Target Cloudflare for static output. Limit the planned same-origin Worker to the four approved lead journeys as specified in the release plan. Keep validation, abuse protection, delivery and provider credentials at the Worker boundary. The website continues to build independently of that runtime.

Consequences: The Worker interface, provider and recipient approvals are prerequisites to enabling lead submission. Cloudflare account, hostname, DNS and deployment decisions stay with their later release milestones.

Affected repository: `clt-barq-digital-site`. See [module ownership](SYSTEM-ARCHITECTURE.md) and [local evidence](MS-002-architecture.md).

## Usage rules

- Treat this file as a working document, not a decorative template.
- Fill it before asking Cursor to implement related work.
- If information is unknown, write `Needs Review` instead of guessing.
- Link entries to Feature IDs, milestones, domains, applications, and repositories whenever possible.
- Update this file after implementation if the actual result differs from the plan.
