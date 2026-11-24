# Astro Content Template

Governed Astro 7 starter for bilingual static content websites (`ar` / `en`).

**Template version:** 1.1.0 — see [`docs/TEMPLATE-VERSION.md`](docs/TEMPLATE-VERSION.md) and [`docs/TEMPLATE-CHANGELOG.md`](docs/TEMPLATE-CHANGELOG.md).

This template ships:

- Static HTML-first architecture (no CMS or adapter in baseline)
- Prefixed locales with Arabic as default (`/ar`, `/en`)
- Locale-paired fonts: Tajawal (`ar`) + Manrope (`en`) via Astro Fonts
- Light / Dark / Auto color themes (default `auto`) with Tailwind `dark:` class strategy
- Local Markdown Content Collections for articles
- Astro-first production UI kit (buttons, cards, badges, breadcrumbs)
- Header Vue chrome: NavigationMenu + ThemeToggle + LanguageSwitcher (`client:load`)
- Optional production GA4 with CookieConsent (`PUBLIC_GOOGLE_ANALYTICS_MODE`, default **opt-in**)
- Public bilingual shadcn-vue component catalog at `/ar/components` and `/en/components`
- Centralized BaseHead SEO layer, structured data, sitemap, RSS, and generated `robots.txt`
- Tailwind CSS 4, TypeScript strictest, ESLint (Astro + Vue), Prettier, Vitest, Playwright, CI

## Requirements

- Node.js `>= 24 < 25` (`.nvmrc` `24`)
- **npm** (committed `package-lock.json`; use `npm ci`)

## Quick start

```bash
npm ci
cp .env.example .env   # optional for local; set PUBLIC_SITE_URL for real deploys
npm run dev
```

Open the default locale home at `/ar`.

## Scripts

| Command                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Local development server                             |
| `npm run fix:format`    | Prettier write (mutating)                            |
| `npm run fix:lint`      | ESLint `--fix` (mutating)                            |
| `npm run validate`      | format check + lint + Astro check + vue-tsc + unit   |
| `npm run build`         | Static production build (artifact only)              |
| `npm run verify`        | budget + links + Playwright (requires prior `build`) |
| `npm run verify:budget` | Route CSS and island JavaScript budget checks        |
| `npm run verify:links`  | Internal routes, assets and fragments in `dist/`     |
| `npm run verify:seo`    | Canonicals, hreflang, robots and sitemap in `dist/`  |
| `npm run verify:e2e`    | Playwright (expects `dist/` already built)           |
| `npm run ci:local`      | `validate` → `build` → `verify`                      |
| `npm run preview`       | Preview `dist/`                                      |

Transitional aliases: `format` / `format:fix` → `fix:format`; `test:budget` / `test:links` / `test:e2e` → `verify:*`.

## Environment

| Variable                          | Required in production | Notes                                                                                                                                |
| --------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_SITE_URL`                 | Yes                    | Absolute origin for canonical URLs, sitemap, robots.txt, and RSS. Replace `example.com` before real deploys. Also `astro:env/server` |
| `ENV`                             | Yes (for real deploys) | Work environment: `local` \| `staging` \| `production` (default `local`). Import `ENV` from `astro:env/server`                       |
| `PUBLIC_DEFAULT_THEME`            | No                     | `light` \| `dark` \| `auto` (default `auto` from Astro `env.schema`)                                                                 |
| `PUBLIC_GOOGLE_ANALYTICS_ID`      | No                     | GA4 Measurement ID (`G-…`). In production, injects when valid unless disabled / mode `off` / opt-in without grant                    |
| `PUBLIC_GOOGLE_ANALYTICS_ENABLED` | No                     | Defaults to `true`. Set `false` to disable GA4 and hide analytics preference UI                                                      |
| `PUBLIC_GOOGLE_ANALYTICS_MODE`    | No                     | `off` \| `opt-out` \| `opt-in` (default **`opt-in`**). Stored `denied` is always honored                                             |

See `.env.example`. Builds warn when `PUBLIC_SITE_URL` is unset or still points at `https://example.com`. Legacy `SITE_URL` is not read. Indexing requires `ENV=production` plus a real origin.

## Analytics

- Production default: inject official GA4 `gtag.js` when `PUBLIC_GOOGLE_ANALYTICS_ID` is a valid `G-…` ID, mode is not `off`, and (default) preference is `granted`
- Default mode `opt-in`: no GA before accept; reject stores versioned `{ state: 'denied', version: 1 }`
- Mode `opt-out` may load before first choice; mode `off` never injects and hides preference UI
- CookieConsent + footer privacy settings when analytics is enabled and mode is not `off` (banner auto-opens only when an ID can load)
- Disable globally with `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false` or `PUBLIC_GOOGLE_ANALYTICS_MODE=off`
- Scripts stay out of `astro dev` and invalid IDs
- No analytics npm package; page views use full document (MPA) loads
- Consent Mode v2 / Privacy Policy extensions: `docs/recipes/consent-aware-analytics.md`

## Color themes

- Modes: `light`, `dark`, `auto`
- Default comes from Astro config (`PUBLIC_DEFAULT_THEME`, default `auto`)
- Visitor choice is stored in `localStorage` under `site-theme` with monotonic schema key `site-theme-schema`
- Tailwind dark styles use the class strategy via `@custom-variant dark (&:where(.dark, .dark *));`
- Prefer semantic tokens in `src/styles/theme.css`; use `dark:` utilities where variant-specific classes help
- **Tailwind-complete for ordinary UI**; Pure/Raw CSS only for tokens/theme, view transitions, keyframes, and rich-text descendants
- shadcn-vue slate surfaces + brand `primary` from `tokens.css`; radius defaults to the small preset (`0.4rem`); project aliases (`--surface-*`, `--text-*`, etc.) map onto theme tokens
- Theme bootstrap runs inline in `BaseLayout` before first paint to avoid a flash of the wrong theme and updates `theme-color`

## Project structure (baseline)

```text
src/
  assets/{images,icons,fonts}   # icons/ is astro-icon iconDir
  components/
    core/              # BaseHead, Analytics, CookieConsent, …
    layout/            # Header, Footer, Container
    astro/{sections,content}
    islands/interactive
    ui                 # project-owned shadcn-vue primitives
  content/articles/{ar,en}
  data/                # site, navigation, social
  i18n/
  layouts/
  lib/{analytics,content,env,mappers,navigation,seo,ui}
  pages/{ar,en}
  styles/
public/
  images/og/default.png
  apple-touch-icon.png
  manifest.webmanifest
tests/{unit,integration,e2e}
scripts/{check-performance-budget,check-internal-links}.mjs
docs/
  astro/                 # template maps, feature baseline, starter decisions (TADR/ADR)
  TEMPLATE-CHANGELOG.md  # template SemVer history
  TEMPLATE-VERSION.md    # template version metadata
  system/                # adopting-project governance (not for template updates)
  standards/             # managed standards
  recipes/               # opt-in adoption guides
  governance/            # standards evolution proposals
```

Vue is approved for the public component catalog island (`FEAT-PLATFORM-002` / ADR-0008) and Header chrome (`FEAT-PLATFORM-004` / ADR-0010). Astro icons use `Icon` from `astro-icon/components` with `iconDir: 'src/assets/icons'` and local Iconify data (`FEAT-PLATFORM-005` / ADR-0011); Vue islands keep `@lucide/vue`. Shared chrome lives under `components/core/` and `components/layout/`; content/sections remain under `components/astro/`.

## Content authoring

1. Add Markdown (`.md`) or MDX (`.mdx`) under `src/content/articles/ar` and/or `en`.
2. Keep frontmatter valid (`locale`, `translationGroup`, `title`, `description`, `publishedAt`, `draft`).
3. Pair translations with the same `translationGroup`.
4. Set `draft: true` to exclude an entry from routes, sitemap, and RSS.
5. Prefer Markdown. Use MDX only when you need allowlisted Astro components.
6. MDX imports must stay within `src/lib/content/rich-text/mdxAllowlist.ts` (starts with `src/components/astro/content/Callout.astro`).

Sample articles are fixture/template content, not production copy.

## Locales and SEO

- Locales: `ar`, `en`
- Default: `ar`
- Every locale is prefixed; public URLs keep trailing slashes
- Language switcher resolves translated equivalents when possible
- Canonical, hreflang, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, and RSS are included
- Default social image: `/images/og/default.png`

## Component catalog

- Routes: `/ar/components`, `/en/components`
- One Vue island (`ComponentCatalog`) hydrated with `client:idle`
- Showcase covers the approved 31-component registry (Toast via Sonner)
- Form demos are local-only (no API / no network mutation)
- Catalog axe checks intentionally disable `color-contrast` for stock shadcn muted/destructive pairs (TD-003); content routes remain fully checked

## Optional additions (not in baseline)

See `docs/recipes/` for host-neutral adoption guides. Install packages only after approval and docs updates:

- Adopting-project cleanup (remove demo catalog/articles)
- Portfolio / Person JSON-LD pages
- Additional Vue islands beyond the catalog
- CMS/API loaders and contracts
- Official Astro adapter for SSR/Actions
- Consent Mode / analytics event allowlists
- Production contact forms and host-specific security/cache config files
- Astro-only header alternative (supersedes ADR-0010 in the adopting project)
- Profile favicon experiment/generate scripts

Use `docs/checklists/ASTRO-ISLAND-APPROVAL-CHECKLIST.md` and the Integrations dependency proposal before adding packages.

## Changelogs and versioning

| File                         | Purpose                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `docs/TEMPLATE-CHANGELOG.md` | Template starter history ([Keep a Changelog](https://keepachangelog.com) + SemVer) |
| `docs/TEMPLATE-VERSION.md`   | Template SemVer metadata and stack baseline                                        |
| `CHANGELOG.md`               | Adopting-project product history only                                              |
| `VERSION.md`                 | Adopting-project SemVer metadata + optional standards sync info                    |
| `docs/system/CHANGELOG.md`   | Adopting-project governance notes only (not Keep a Changelog format)               |

When maintaining this template, update `docs/TEMPLATE-*` and `docs/astro/*` only. Do not append template work to root or `docs/system` changelogs.

## Governance

When maintaining the **template**, read and update:

- `docs/astro/FEATURE-BASELINE.md`
- `docs/astro/DECISIONS.md`
- Other `docs/astro/*` maps relevant to the change
- `docs/TEMPLATE-CHANGELOG.md` / `docs/TEMPLATE-VERSION.md`

When building an **adopting project** from this template, read and update:

- `docs/system/PROJECT-BRIEF.md`
- `docs/system/FEATURE-REGISTRY.md`
- `docs/system/IMPLEMENTATION-PLAN.md`
- Root `CHANGELOG.md` / `VERSION.md` for product releases

Managed standards live under `docs/standards/`. True project-only exceptions (when needed) belong in `docs/standards-overrides/PROJECT-OVERRIDES.md` with owner, reason, Feature ID, and review date. Command taxonomy and fast Git are documented in `docs/standards/` (see `docs/governance/PROPOSAL-COMMAND-TAXONOMY-AND-FAST-GIT.md`).

## Validation evidence

Baseline bootstrap was validated with:

- `npm run validate`
- `npm run build`
- `npm run verify`
