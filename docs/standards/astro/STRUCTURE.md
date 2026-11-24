# Astro Repository Structure and Boundaries

> **Package status:** Managed organization standard.  
> **Framework baseline:** Astro 7.x (latest supported stable minor), Node.js 24 LTS, Vite 8, TypeScript strictest, Tailwind CSS 4.  
> **Primary use:** Informational, marketing, portfolio, content-heavy, and CMS-driven public websites.  
> **Authority:** This document operates under the company Project Start SOP and project-specific system documentation.

## SOP traceability

This standard defines **how** Astro work is implemented. It does not independently define **what** must be built. Before implementation, the requested work must be traceable to:

- project or product scope
- application/repository ownership
- Feature ID
- approved route/page inventory
- milestone and acceptance criteria
- content ownership and freshness model
- locale and SEO requirements
- approved rendering mode
- API/CMS contract when applicable

When required context is missing, Cursor must return a readiness report and must not invent architecture or content contracts.

---

# Astro Frontend Structure

## Purpose

This document defines the canonical folder structure, file placement rules, naming policy, and dependency direction for Astro websites.

It supports:

- informational and corporate websites
- landing pages
- personal and portfolio sites
- multilingual content sites
- headless CMS websites
- primarily static sites with limited Vue islands

Engineering behavior is governed by `CONTRIBUTING.md`.

---

## 1. Structural principles

- `src/pages` owns routes only.
- pages orchestrate; they do not own raw data-access details.
- `.astro` is the default component format.
- Vue lives only in explicit Vue Island boundaries.
- Astro Components, UI Primitives, Vue Islands, and Composite Patterns are separate.
- external data contracts and view models are separate when they differ.
- build-time content and live content have separate configuration files.
- imports are explicit; Astro projects do not depend on implicit global component registration.
- directory depth must reflect meaning, not arbitrary nesting.

---

## 2. Canonical project tree

```text
astro-project/
├── .cursor/
│   └── rules/
│       └── astro/
│           └── astro-ai-execution.md
├── docs/
│   └── standards/
│       └── astro/
│           └── 01-standards/
│               ├── CONTRIBUTING.md
│               ├── STRUCTURE.md
│               ├── COMPONENTS.md
│               ├── INTEGRATIONS.md
│               ├── DATA-AND-CONTENT.md
│               ├── RENDERING.md
│               ├── I18N-AND-SEO.md
│               ├── STYLING.md
│               ├── TESTING.md
│               ├── FRONTEND-AI.md
│               └── PR-REVIEW-CHECKLIST.md
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── static/
├── src/
│   ├── actions/                    # Optional: Astro server actions
│   │   └── index.ts
│   ├── assets/
│   │   ├── fonts/                  # Optional local font sources (prefer Astro Fonts API)
│   │   ├── icons/                  # astro-icon iconDir for bespoke local SVGs
│   │   └── images/
│   ├── components/
│   │   ├── core/                   # Shared chrome: BaseHead, StructuredData, Analytics, CookieConsent, FormField
│   │   ├── layout/                 # Header, Footer, Container (no Client State)
│   │   ├── astro/                  # Page/content Astro components (no Client State)
│   │   │   ├── sections/
│   │   │   ├── content/
│   │   │   └── motion/
│   │   ├── islands/                # Hydrated Vue Island boundaries
│   │   │   ├── navigation/
│   │   │   ├── forms/
│   │   │   ├── dialogs/
│   │   │   ├── carousels/
│   │   │   └── interactive/
│   │   ├── ui/                     # shadcn-vue UI Primitives
│   │   ├── patterns/               # Composite Patterns
│   │   └── vectors/                # Larger trusted vector components
│   ├── constants/                  # Optional thin re-exports; prefer src/data/ for site/nav/social
│   ├── data/                       # Site, navigation, social, and other static config modules
│   ├── content/                    # Local Markdown/MDX/data entries
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── dictionaries/
│   │   │   ├── ar/
│   │   │   └── en/
│   │   └── helpers.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── WebsiteLayout.astro
│   │   └── ContentLayout.astro
│   ├── lib/
│   │   ├── api/
│   │   ├── content/
│   │   ├── forms/
│   │   ├── mappers/
│   │   ├── schemas/                # External/content schemas
│   │   ├── validation/             # Shared Zod form schemas
│   │   ├── ui/
│   │   └── seo/
│   ├── middleware.ts               # Optional: request middleware
│   ├── pages/
│   │   ├── ar/
│   │   ├── en/
│   │   ├── 404.astro
│   │   └── index.astro             # Optional locale redirect/selector
│   ├── scripts/                    # Small client scripts/helpers
│   ├── styles/
│   │   ├── global.css
│   │   ├── theme.css
│   │   ├── tokens.css
│   │   └── typography.css
│   ├── types/
│   ├── utils/
│   ├── content.config.ts           # Build-time content collections
│   ├── env.d.ts
│   └── live.config.ts              # Optional live collections
├── tests/
│   ├── e2e/
│   ├── fixtures/
│   ├── integration/
│   └── unit/
├── .env.example
├── astro.config.ts
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── prettier.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

Only create optional folders when the project uses them.

---

## 3. Root files

### `astro.config.ts`

Owns framework configuration only:

- `site`
- output mode
- integrations
- i18n routing
- image domains or patterns
- Vite plugins
- adapter configuration
- redirects and build options when appropriate

Do not place feature data or arbitrary application constants here.

### `tsconfig.json`

Must extend:

```json
{
  "extends": "astro/tsconfigs/strictest"
}
```

Add aliases deliberately. Recommended:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### `.env.example`

Lists every environment variable without real secrets. Explain whether each value is public, build-time only, or server-only.

### Lock file

The repository uses one package manager and one lock file. Do not switch package managers inside a feature PR.

---

## 4. Folder roles

### `src/pages/`

Every supported page file creates a route.

Use pages for:

- route parameters
- locale resolution
- route-level metadata
- calling named data/query functions
- selecting a layout
- composing major sections
- route-specific redirects or status handling

Do not use pages for:

- repeated detailed markup
- raw API clients
- reusable data transforms
- global scripts
- large inline style systems

#### Locale folders

When every route is prefixed, use literal locale folders:

```text
src/pages/
├── ar/
│   ├── index.astro
│   ├── about.astro
│   └── services/
│       ├── index.astro
│       └── [slug].astro
└── en/
    ├── index.astro
    ├── about.astro
    └── services/
        ├── index.astro
        └── [slug].astro
```

Do not use a dynamic `[locale]` route unless the project deliberately implements custom locale routing.

#### Route grouping

Use a folder when a route has multiple child pages:

```text
services/index.astro
services/[slug].astro
```

Use a single file for one standalone route:

```text
privacy.astro
```

### `src/layouts/`

Layouts define reusable page shells.

Recommended responsibilities:

- `<html lang dir>`
- global metadata defaults
- favicons and manifest links
- skip link and main landmark
- header and footer composition
- global scripts approved for every route

Do not create a new layout for a one-off spacing variation.

### `src/components/core/`

Reusable site-wide Astro chrome without Client State:

```text
core/
├── BaseHead.astro
├── StructuredData.astro
├── Analytics.astro
├── CookieConsent.astro
└── FormField.astro
```

SEO tags, JSON-LD injection, analytics loading (opt-out CookieConsent), and shared form field shells belong here. Prefer composing `BaseHead` from `BaseLayout` rather than duplicating meta tags per page.

### `src/components/layout/`

Document chrome without Client State:

```text
layout/
├── Header.astro
├── Footer.astro
└── Container.astro
```

Header/footer shells may wrap a single approved Vue island (for example `HeaderChrome`). Width constraints (`Container`) are page/section-owned unless a layout intentionally owns them.

### `src/components/astro/`

Page and content Astro Components without Client State. Use the semantic subfolder that owns the responsibility:

```text
astro/
├── sections/
├── content/
└── motion/
```

Hero and Features sections, static cards, breadcrumbs, CMS presentation, and CSS-only Marquee belong here when they need no browser state. Do not place site-wide SEO/analytics/header/footer chrome here — use `components/core/` and `components/layout/`.

### `src/components/ui/`

Project-owned UI Primitives added from `shadcn-vue`, normally built on Reka UI. Organize multi-file primitives by kebab-case component name:

```text
ui/
├── button/
├── dialog/
├── dropdown-menu/
├── navigation-menu/
├── input/
├── form/
├── accordion/
└── carousel/
```

This folder contains low-level Vue behavior and Design System styling, not project sections or business content. Review generated code and do not overwrite local customizations without a diff.

### `src/components/islands/`

Top-level Vue Islands and tightly local Vue children. Organize by interaction domain:

```text
islands/
├── navigation/
├── forms/
├── dialogs/
├── carousels/
└── interactive/
```

Only the Island root is imported by Astro. Internal Vue children do not become separate hydrated roots when they share state.

### `src/components/patterns/`

Composite Patterns compose several UI Primitives into reusable project behavior:

```text
patterns/
├── HeaderChrome.vue          # Prefer islands/interactive when it is the hydrated header boundary
├── ContactForm.vue
├── TestimonialsCarousel.vue
└── FAQAccordion.vue
```

Patterns are not UI Primitives. They may contain project labels, content contracts, or coordinated behavior. An imported pattern becomes a Vue Island only when the Astro caller adds a Client Directive.

### Static content rendering

Components for structured content live under `components/astro/content`.

Examples:

- rich text
- article cards
- author blocks
- table of contents
- content pagination
- CMS portable-text or block renderers

These components may understand content concepts but must not perform networking.

### `src/assets/icons/` (`astro-icon` `iconDir`)

Project-owned, trusted SVG files for bespoke icons that are unavailable in the approved Iconify collections or require tightly controlled markup. Configure as `icon({ iconDir: 'src/assets/icons' })`.

Routine UI icons use `astro-icon` with `@iconify-json/lucide`; company and platform logos use `@iconify-json/simple-icons`. Do not duplicate those icons as local files.

Prefer stable, descriptive filenames (for example `arrow-right.svg`, `menu.svg`).

### `src/components/vectors/`

Larger trusted SVG illustrations or decorative brand graphics. Keep very large assets referenced rather than inlined.

### `src/assets/`

Processed local assets.

- use `images/` for raster and local optimized images
- prefer Astro Fonts API for provider fonts (baseline: Tajawal + Manrope); use `fonts/` only for additional self-hosted sources not covered by Astro Fonts
- use `icons/` as the `astro-icon` `iconDir` for local SVGs (not `src/components/icons`)

Prefer colocating an image with local content when that improves ownership.

### `public/`

Files served as-is without Astro processing.

Use for:

- favicon files
- `robots.txt`
- web manifests
- downloadable documents
- files requiring stable public URLs
- assets intentionally excluded from image processing

Do not place ordinary page images here by habit.

### `src/lib/api/`

```text
api/
├── client.ts
├── errors.ts
├── pages.ts
├── services.ts
└── contact.ts
```

- `client.ts` owns base URL, headers, timeouts, and response handling
- endpoint files own named request functions
- no UI markup
- no Vue state

### `src/lib/content/`

```text
content/
├── loaders/
├── queries/
├── rich-text/
└── content-errors.ts
```

Use for Content Collection loaders, remote CMS collection logic, and query functions.

### `src/lib/mappers/`

Explicit DTO/content-to-view-model conversions.

Name by conversion:

```text
mapServiceDtoToService.ts
mapArticleEntryToCard.ts
```

### `src/lib/schemas/` and `src/lib/validation/`

Runtime validation schemas for:

- CMS responses
- API responses
- form input
- structured data
- environment-dependent configuration

Use `lib/validation` specifically for shared Zod form schemas. Content/API schemas and form schemas have different ownership even if both use Zod.

### `src/lib/forms/`

Server submission adapters, mutation orchestration, and shared form handling. It must not contain Vue state or expose secrets to Client Code.

### `src/lib/ui/`

Pure UI configuration and helpers shared by UI Primitives, including the approved `cn()` utility when adopted.

### `src/lib/seo/`

```text
seo/
├── createPageSeo.ts
├── createCanonicalUrl.ts
├── createLocaleAlternates.ts
└── structured-data/
```

### `src/i18n/`

Holds locale configuration, dictionary loading, route mappings, and locale helpers.

Recommended dictionaries:

```text
dictionaries/
├── ar/
│   ├── common.ts
│   ├── home.ts
│   └── services.ts
└── en/
    ├── common.ts
    ├── home.ts
    └── services.ts
```

Keep the same key shape between languages. Translation keys use `snake_case`.

### `src/content/`

Local content entries used by Content Collections.

```text
content/
├── articles/
│   ├── ar/
│   └── en/
└── team/
```

The collection loader and schema belong in `src/content.config.ts`, not inside individual pages.

### `src/actions/`

Optional server actions. Use only when an adapter and on-demand rendering are approved.

Actions own server-side mutation boundaries, validation, and secure service calls. They do not replace a full backend where one already exists.

### `src/scripts/`

Small browser scripts that do not justify Vue.

Examples:

- theme initialization
- copy-to-clipboard enhancement
- progressive navigation behavior

Scripts must be focused and safe under repeated page transitions if view transitions are introduced.

### `src/styles/`

- `tokens.css`: design tokens and Tailwind theme variables
- `theme.css`: light/dark or brand theme mappings
- `typography.css`: prose and font rules
- `global.css`: imports, reset, base elements, accessibility helpers

Do not create one stylesheet per component when utilities are sufficient.

### `src/types/`

Shared internal application types that are not transport DTOs and do not belong to a single module.

### `src/constants/`

Typed stable values. Avoid hardcoding route fragments, supported locales, or reusable configuration throughout the project.

### `src/utils/`

Small pure helpers only. Prefer colocating a helper with its feature if it has no broad reuse.

### `tests/`

- `unit/`: pure logic, schemas, mappers, metadata factories
- `integration/`: component/content integration and rendered output
- `e2e/`: browser journeys, locale, SEO, forms, navigation
- `fixtures/`: stable test data only

---

## 5. Naming rules

### Folders

`kebab-case`

### Astro, Vue, and component files

`PascalCase`

Use descriptive names. Existing project prefixes may be preserved during migration, but new projects rely on the folder taxonomy rather than encoding the layer twice in every filename.

### TypeScript files

`camelCase`

Examples:

- `createPageSeo.ts`
- `getServices.ts`
- `mapServiceDtoToService.ts`

### Types and interfaces

`PascalCase`

### Constants

Use `SCREAMING_SNAKE_CASE` for module constants and `camelCase` for exported configuration objects when appropriate.

### Translation keys

`snake_case`

### Tests

Match the subject:

```text
createPageSeo.test.ts
contact-form.spec.ts
```

---

## 6. Import boundaries

Recommended dependency direction:

```text
pages
  -> layouts
  -> Astro Components
  -> Composite Patterns or Vue Islands
  -> lib query/service functions

Vue Islands / Composite Patterns
  -> internal Vue children
  -> UI Primitives
  -> lib/api for client requests

UI Primitives
  -> icons, tokens, pure utilities
```

Forbidden directions:

- `ui` importing `patterns`, `islands`, or project-aware Astro sections
- `ui` importing route pages
- `lib/api` importing components
- content loaders importing page components
- an internal Vue child being consumed directly by unrelated routes
- generic libraries importing project-aware content

Circular dependencies are release blockers.

---

## 7. File-placement decision guide

Ask in order:

1. Does it create a URL? → `pages`
2. Does it define a document/page shell? → `layouts`
3. Does it need no Client State? → `components/core` or `components/layout` for shared chrome; otherwise `components/astro`
4. Is it a shadcn-vue/Reka UI Primitive? → `components/ui`
5. Is it a reusable composition of primitives? → `components/patterns`
6. Does it own a hydrated browser-state boundary? → `components/islands`
7. Is it external-data access? → `lib/api` or `lib/content`
8. Is it external-to-internal mapping? → `lib/mappers`
9. Is it external/content validation? → `lib/schemas`; shared form validation? → `lib/validation`
10. Is it pure and broadly reusable? → `utils`

If none applies clearly, reconsider whether a new file is necessary.


---

## 8. Documentation placement

Project documents are separated from managed standards:

```text
docs/
├── standards/astro/       # managed company standards
├── system/                # copied or linked shared system documents
├── astro/                 # project-specific Astro maps and decisions
└── overrides/             # approved project exceptions
```

Do not edit managed standards locally. Record project-specific decisions in project docs or overrides.

## 9. Feature traceability

Every new meaningful file must be traceable to:

- Feature ID
- route or content type
- layer
- owner
- milestone
- purpose

A file with no clear traceability should not be created.
