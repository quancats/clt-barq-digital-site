# Barq Digital website architecture

## Rendering and application boundary

The `clt-barq-digital-site` repository owns the Barq Digital corporate site. Astro builds directory-format static HTML into `dist/`. Tailwind CSS 4 runs through its Vite integration. Astro layouts and components render the content and navigation. Existing Vue 3 and Reka UI islands cover header interactions and the inherited component catalog. Review any new island for hydration, accessibility and client bundle impact.

The Arabic-first public route contract has Arabic at the root and English under `/en/`. The current starter uses `/ar/` and `/en/` with a 302 from `/` to `/ar/`, as defined in `src/data/hostRedirects.mjs`. MS-004 owns the route transition, alternate mappings and redirect reconciliation.

BIM is an externally operated product showcased by this website. The site owns approved copy, screenshots and outbound links. BIM product engineering, accounts, stores, administration and legal changes belong to its external owners.

## Content and integrations

Typed dictionaries own localized interface copy. Astro Content Collections own structured public content at build time. Markdown is the default. Use MDX only for reviewed repository-authored content that needs allowlisted components. The article collection and inherited fixtures are the current implementation. Later work will establish the broader publication model and verify that sample and draft content stays out of the public release.

The static site has no project database, custom CMS, site application backend or server adapter. Cloudflare static hosting is the v1.0 target. The one planned runtime boundary is a same-origin lead Worker for the four approved form journeys. The Worker will own validation, abuse protection, provider delivery and server-side configuration. Credentials, recipient routing and provider implementation remain within that boundary. Review the interface and approved operating inputs before implementing or enabling it. See [API contracts](API-CONTRACTS.md).

The build already emits a Cloudflare-compatible `_redirects` file and gates indexing by environment and public origin. Hosting resources, account access, hostname and live DNS need separate authorization during their assigned release milestones.

## Module ownership

| Existing path                                                                             | Ownership and boundary                                                                                                                                         |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/`                                                                              | Page owner. Compose layouts and view models, supply localized route context, and enumerate static dynamic paths.                                               |
| `src/layouts/`, `src/components/layout/`, `src/components/core/`                          | Frontend foundation. Own page chrome, metadata and shared document structure.                                                                                  |
| `src/components/astro/content/`, `src/components/astro/sections/`                         | Frontend component and page owners. Keep shared primitives composable and page sections with their feature.                                                    |
| `src/components/islands/`, `src/components/ui/`                                           | Frontend foundation. Own explicit Vue island entry points and UI primitives used by those islands.                                                             |
| `src/styles/`, `src/assets/`, `public/`                                                   | Design and frontend owners. Keep global tokens coordinated, process source assets at build time and reserve public files for directly served, approved assets. |
| `src/content.config.ts`, `src/content/`, `src/lib/content/`, `src/lib/mappers/`           | Content architect with editorial owners. Own schemas, approved entries, queries and view-model mapping.                                                        |
| `src/i18n/`, `src/data/navigation.ts`, `src/data/hostRedirects.mjs`, `src/lib/seo/`       | Locale and SEO owners with the technical lead. Keep paths, navigation, alternates, redirects and indexing policy aligned.                                      |
| `astro.config.ts`, `package.json`, `pnpm-lock.yaml`, `src/lib/env/`, `.github/workflows/` | Technical lead with the assigned foundation writer. Own build and environment contracts, dependencies and automation.                                          |
| `scripts/`, `tests/`, Vitest and Playwright configuration                                 | QA and affected module owners. Assert source behavior and inspect built artifacts.                                                                             |

The dependency direction is routes → layouts and components or page view models → content queries and shared helpers → schemas and source data. Views receive data through props. Avoid importing a route or feature-specific page section into a shared primitive.

## Shared runtime contracts

- Arabic is RTL and English is LTR. Shared interface copy uses dictionaries. The page passes the locale to the layout and SEO helpers.
- The theme supports light, dark and system preferences. `PUBLIC_DEFAULT_THEME` sets the initial policy. The initialization script resolves the theme before first paint and applies the `dark` class to the document. The visitor preference uses the `site-theme` local storage key.
- Production builds require a public `PUBLIC_SITE_URL` origin for absolute metadata. Preview output must stay non-indexable. Central SEO helpers and built-artifact checks cover metadata and redirects.
- The public site has no admin area or authenticated endpoints. Keep credentials server-side within the approved integration. Review schema changes alongside their query and route consumers.
- Keep the managed standards under `docs/standards/` intact and record project exceptions in `docs/standards-overrides/`.

See the [application map](APPLICATION-MAP.md), [data ownership](DATA-OWNERSHIP.md), [project ADRs](DECISIONS.md), [MS-002 evidence and conventions](MS-002-architecture.md), and [managed Astro structure standard](../standards/astro/STRUCTURE.md).
