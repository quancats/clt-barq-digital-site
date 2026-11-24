# Changelog

All notable changes to this Astro template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file tracks the Astro template starter itself.
Template version metadata: [`TEMPLATE-VERSION.md`](TEMPLATE-VERSION.md).
Template frontend documentation: [`docs/astro/`](astro/) (maps, feature baseline, starter ADRs).

Adopting projects must use root `CHANGELOG.md` / `VERSION.md` for product SemVer history, and may use `docs/system/CHANGELOG.md` for governance notes (not Keep a Changelog format). Do not record template-maintainer work in those adopting-project files.

## [Unreleased]

## [1.2.0] - 2026-11-20

### Added

- Route CSS budgets for the locale homes and catalog, sized from the 1.1.1 output.
- Cloudflare Workers routing recipe and a build-generated `_redirects` file with the root destination derived from `defaultLocale`.
- Static output checks for canonicals, reciprocal hreflang, robots.txt and sitemap membership, plus source-aware internal URL and fragment checks.
- Executable recipe examples for migration redirects, advanced Consent Mode and a locale-isolated build-time CMS loader.

### Changed

- Production requires a public `PUBLIC_SITE_URL` origin. Preview pages use `noindex` and omit the sitemap. Public previews allow crawling, while authenticated private previews can also disallow crawling.
- Cloudflare Static Assets returns the root locale redirect as HTTP 302. Astro still builds both prefixed locales.
- The catalog uses direct vee-validate rules and checked-in Tailwind state variants. The Zod adapter, direct Zod and shadcn-vue CLI were removed from the template dependencies.

### Fixed

- Static header links work before hydration, and the catalog provides direct links when its Vue search is unavailable.
- Mobile navigation scrolls in short viewports and supports keyboard activation, while only matching links carry `aria-current="page"`.
- Narrow bilingual content and catalog demos wrap, and axe checks color contrast in both themes and locales.

### Adoption from 1.1.1

- Set `ENV=production` and the actual `PUBLIC_SITE_URL` origin for public builds. Use `ENV=staging` or `ENV=local` for previews and authenticate access to private previews.
- Copy the adopting project's assets-only Wrangler settings from the [routing recipe](recipes/routing-and-host-redirects.md). Move existing `public/_redirects` entries to the shared redirect map, then validate the Wrangler preview and deployed host separately.
- Use `npm run verify:seo -- production` for the production artifact. The default Playwright baseline uses the preview artifact.

## [1.1.1] - 2026-11-20

### Changed

- Updated Astro, Vue, Tailwind CSS, the icon packs, the component catalog dependencies, and the validation tools. [#1](https://github.com/quancats/astro-template/issues/1)

### Fixed

- Included the selected country in the catalog Combobox trigger’s accessible name in both locales.
- Bound the catalog avatar URL through a script constant for compatibility with Vue template type checking.

### Security

- Updated Astro and Vue to versions that address the advisories reviewed for this release. Refreshed the Zod 4 dependency used to validate RSS metadata at build time.
- Updated transitive `proxy-addr`, `fast-uri`, and `brace-expansion` to address additional npm audit findings.

## [1.1.0] - 2026-08-22

Workflow, privacy, env typing, UI primitives, and standards sync after six adopting-site release branches.

### Changed

- Analytics default mode is now `opt-in` (TADR-0002); privacy settings remain available when analytics is enabled without an ID; banner auto-opens only when a Measurement ID can load
- Astro `env.schema` registers `ENV` (`local` \| `staging` \| `production`) and `PUBLIC_SITE_URL`; import from `astro:env/server`. `robots.txt` indexes only when `ENV=production` and origin is not `example.com`
- Site origin env var is **`PUBLIC_SITE_URL` only** (legacy `SITE_URL` no longer read); `astro.config.ts` uses Vite `loadEnv` for config-time resolution
- npm scripts separated into `fix:*` / `validate` / `build` (artifact only) / `verify:*`; CI workflow is **manual `workflow_dispatch` only** (no push/PR auto-run); local parity via `ci:local`
- Theme preference storage is schema-versioned (`site-theme-schema`) without changing `light` / `dark` / `auto` modes
- Performance budget script uses a data-driven island list so adopters can drop catalog without rewriting assertions
- Sitemap filters non-indexable URLs via `isIndexableSitemapPage`
- `robots.txt` origin-gates indexing: fallback `example.com` emits `Disallow: /` (also requires `ENV=production` for Allow)
- `ButtonLink` accepts optional `target` / `rel` for external CTAs
- Issue titles are name-only; milestone/type/priority use GitHub Milestone / Labels / Issue Types
- Styling policy is Tailwind-complete for ordinary UI (TADR-0003); Pure/Raw CSS limited to tokens/theme, view transitions, keyframes, and generated-content selectors (skip-link moved to utilities)
- Managed `docs/standards/` synced: command taxonomy + fast Git workflow (`TESTING.md`, `DEPLOYMENT-AND-OPERATIONS.md`, `CONTRIBUTING.md`, `GIT-WORKFLOW.md`, `COMMIT-STANDARDS.md`, `PR-GUIDE.md`)

### Added

- shadcn-vue Combobox primitives (`src/components/ui/combobox`) with searchable catalog demo (ported from quancats-site); catalog registry now **35** components
- Typed app environment helpers (`src/lib/env/appEnv.ts`)
- Viewport/RTL overflow Playwright coverage for representative routes
- Parameterized `createOrganizationJsonLd` / `createPersonJsonLd` (+ optional WebSite `linkPerson`) with no shipped identity data
- Adoption recipes: cleanup, portfolio/Person JSON-LD, favicons, content consistency gate, analytics events allowlist
- Faster local Git Cursor rules and commit/split commands (batch snapshot, pathspecs, milestone-sized PRs)
- TADR-0002 (opt-in analytics, `PUBLIC_SITE_URL`, validate/build/verify), TADR-0003 (Tailwind-complete styling)

### Migration from 1.0.0

- Set `PUBLIC_SITE_URL` (rename from legacy `SITE_URL` if used)
- Set `ENV=production` on real deploys; keep `local` for dev/CI
- Run `npm run validate` before `npm run build`; use `ci:local` instead of expecting `build` to typecheck
- Run `npm run build` before `npm run verify:e2e` (or use `ci:local`)
- For pre-choice GA under the 1.0.0 default, set `PUBLIC_GOOGLE_ANALYTICS_MODE=opt-out` explicitly
- Re-enable CI `push`/`pull_request` triggers in `.github/workflows/ci.yml` if your fork needs automatic CI

## [1.0.0] - 2026-07-31

Initial Astro content-template baseline for bilingual static sites.

### Added

- Astro 7 static shell (`output: 'static'`, `trailingSlash: 'always'`) with TypeScript strictest, Tailwind CSS 4, and Node `>=24 <25`
- Prefixed bilingual routes (`ar` default, `en`), Content Collections articles (Markdown + MDX with allowlisted `Callout`), sitemap, RSS, and dynamic `robots.txt`
- Site chrome: `Header` / `Footer`, Vue `HeaderChrome` island (nav, language, theme, mobile Sheet), full-bleed layouts with page-owned `Container`, and redesigned 404/500 `ErrorPage` surfaces
- Theme modes `light` / `dark` / `auto` (default `auto`), locale-paired fonts (Tajawal + Manrope via Astro Fonts), semantic tokens, and native CSS view transitions
- Core SEO layer (`BaseHead`, StructuredData / JSON-LD, OG defaults), optional production GA4 with CookieConsent modes (`off` / `opt-out` / `opt-in`), and `FormField`
- Governed icons (`astro-icon` + Lucide / Simple Icons), Astro UI primitives (`ButtonLink`, Card, Badge, Breadcrumbs), and bilingual shadcn-vue component catalog
- Quality toolchain: ESLint, Prettier, Vitest, Playwright (incl. Axe), performance budgets, link checks, and GitHub Actions CI with `static-dist` artifact
- Template docs under `docs/astro/` (maps, FEATURE-BASELINE, TADR/ADR decisions), platform-neutral `docs/recipes/`, managed standards sync, and this SemVer history (`TEMPLATE-*`)
- Feature baseline: `FEAT-PLATFORM-001`–`010`, `FEAT-CONTENT-001` (npm-only package manager)

[Unreleased]: https://github.com/quancats/astro-template/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/quancats/astro-template/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/quancats/astro-template/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/quancats/astro-template/releases/tag/v1.0.0
