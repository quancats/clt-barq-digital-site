# Domain Map

## Purpose

This file defines business domains, their ownership, responsibilities, dependencies, and boundaries.

## Domains

| Domain    | Purpose                                            | Primary application | Owns                                               | Must not own         | Notes                   |
| --------- | -------------------------------------------------- | ------------------- | -------------------------------------------------- | -------------------- | ----------------------- |
| Platform  | Tooling, structure, layouts, themes, quality gates | site                | Config, scripts, CI, design tokens, theme behavior | Product content copy | FEAT-PLATFORM-001       |
| Content   | Articles and content presentation                  | site                | Local article entries, content queries, content UI | Remote CMS schemas   | FEAT-CONTENT-001        |
| LocaleSeo | Locales, dictionaries, metadata, feeds             | site                | i18n config, SEO helpers, sitemap/RSS              | Fabricated claims    | Shared by both features |

## Domain template

### Domain: Platform

Purpose: Provide the reusable Astro template baseline.

Responsibilities:

- Repository structure and naming
- Tailwind tokens and global styles
- Light/dark/auto theme resolution and persistence
- Lint/format/typecheck/test/CI scripts

Owns:

- `astro.config.ts`, toolchain configs, layouts shell, static UI components, `src/scripts/theme.ts`

Must not own:

- Editorial article bodies

Related features: FEAT-PLATFORM-001

Related tables: None

Related APIs: None

Related UI areas: Layouts, header/footer chrome

### Domain: Content

Purpose: Local bilingual articles via Content Collections.

Responsibilities:

- Article schema and queries
- Article list/detail routes
- Draft exclusion
- Trusted MDX component-import policy

Owns:

- `src/content/articles/**`, `src/content.config.ts`, content components

Must not own:

- CMS publication workflows

Related features: FEAT-CONTENT-001

Related tables: None (repository files only)

Related APIs: None

Related UI areas: Home teaser, articles index, article detail

### Domain: LocaleSeo

Purpose: Equal Arabic/English delivery and indexability.

Responsibilities:

- Locale routing and direction
- Dictionaries and language switching
- Canonical/alternates/OG/sitemap/RSS

Owns:

- `src/i18n/**`, `src/lib/seo/**`, feed/sitemap/robots

Must not own:

- Invented SEO facts not present in content

Related features: FEAT-PLATFORM-001, FEAT-CONTENT-001
