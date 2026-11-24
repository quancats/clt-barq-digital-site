# Template Version

Version metadata for this Astro starter while it is maintained as a template.

This file tracks the Astro template starter version and stack baseline.
After adoption, projects use root `VERSION.md` / `CHANGELOG.md` for product SemVer history.

Versioning follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).
Release notes follow [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) in [`TEMPLATE-CHANGELOG.md`](TEMPLATE-CHANGELOG.md).

| Field                | Value                                                                            |
| -------------------- | -------------------------------------------------------------------------------- |
| Template name        | astro-template                                                                   |
| Template version     | 1.2.0                                                                            |
| Candidate date       | 2026-11-20                                                                       |
| Release status       | Candidate pending review                                                         |
| Versioning scheme    | SemVer 2.0.0                                                                     |
| Changelog standard   | Keep a Changelog 1.1.0                                                           |
| Framework baseline   | Astro 7.x (`^7.4.13`)                                                            |
| Node.js              | `>=24 <25` (`.nvmrc` `24`)                                                       |
| TypeScript           | strictest (`^5.9.3`)                                                             |
| Styling              | Tailwind CSS 4 (`^4.3.5`) via `@tailwindcss/vite`                                |
| Content              | Markdown + MDX (`@astrojs/mdx` `^8.1.6`)                                         |
| Feeds / SEO          | `@astrojs/sitemap` `^3.7.6`, `@astrojs/rss` `^4.0.19`                            |
| Quality              | ESLint, Prettier, Vitest, Playwright, GitHub Actions CI (`workflow_dispatch`)    |
| Locales              | `ar` (default), `en` — all routes prefixed                                       |
| Feature baseline     | FEAT-PLATFORM-001..010, FEAT-CONTENT-001 (see `docs/astro/FEATURE-BASELINE.md`)  |
| Icons                | `astro-icon` (`iconDir: src/assets/icons`) + Lucide + Simple Icons               |
| UI catalog           | 35 shadcn-vue primitives incl. Combobox (searchable select)                      |
| Analytics            | GA4 + CookieConsent; `PUBLIC_GOOGLE_ANALYTICS_MODE` default `opt-in` (TADR-0002) |
| Site origin          | `PUBLIC_SITE_URL` in `astro:env/server` + `loadEnv` in `astro.config.ts`         |
| App environment      | `ENV` (`local` \| `staging` \| `production`) via `astro:env/server`              |
| Latest release notes | [`1.2.0`](TEMPLATE-CHANGELOG.md#120---2026-11-20)                                |

## Notes

- Prefer Markdown; use MDX only with allowlisted components (`src/lib/content/rich-text/mdxAllowlist.ts`).
- Theme modes are `light` / `dark` / `auto` with class-based Tailwind `dark:` support.
- Shared chrome uses `src/components/core/` and `src/components/layout/`; content/sections remain under `src/components/astro/{sections,content}`. Astro icons use `Icon` from `astro-icon/components` with `iconDir: 'src/assets/icons'`.
- Approved Vue islands: component catalog + HeaderChrome (see `docs/astro/ISLAND-MAP.md`). CMS SDKs and adapters remain out of baseline. Optional GA4 uses official `gtag.js` when `PUBLIC_GOOGLE_ANALYTICS_ID` is set in production per analytics mode (no analytics npm SDK).
- Package manager is **npm** only (`package-lock.json` + `npm ci`).
- Command layers: `fix:*` → `validate` → `build` → `verify:*`; local `ci:local` (see TADR-0002 and `docs/standards/astro/TESTING.md`).
- Styling: Tailwind-complete ordinary UI (TADR-0003); limited Pure/Raw CSS exceptions documented in `STYLING.md`.
- Bump `Template version` here when cutting a template release, and add a matching `## [X.Y.Z] - YYYY-MM-DD` section in `TEMPLATE-CHANGELOG.md`.
- Template docs to update when maintaining the starter: `docs/astro/*`, this file, and `TEMPLATE-CHANGELOG.md`.
- Project history after adoption: root `CHANGELOG.md` / `VERSION.md` (do not use for template-maintainer work).
- Adopting-project governance notes: `docs/system/CHANGELOG.md` (do not use for template-maintainer work).

## Upgrade from 1.0.0

See [TEMPLATE-CHANGELOG.md § 1.1.0 Migration](TEMPLATE-CHANGELOG.md#migration-from-100) for `PUBLIC_SITE_URL`, `ENV`, npm script layers, analytics default, and CI trigger notes.

## Component generation

The template checks in the Vue primitives and the Tailwind state variants they use. To generate a new component, run `npx shadcn-vue@2.9.0 add <component>` in the adopting project, then review the generated files, dependency changes and any new Tailwind variants against `src/styles/component-variants.css`. The version matches the generator previously installed in the template. Component generation is a separate maintenance operation from installing, building or deploying the site.
