# Template Feature Baseline

Feature IDs that ship with this Astro template starter.

Template maintainers update this file (and other `docs/astro/*` maps) when the starter evolves.
Adopting projects register **their** product features in `docs/system/FEATURE-REGISTRY.md` — do not treat that file as the template changelog.

## Registry

| Feature ID        | Feature                         | Status | Milestone | Notes                                                                                                                                                                 |
| ----------------- | ------------------------------- | ------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FEAT-PLATFORM-001 | Astro content template baseline | Done   | MS-001    | Tooling, structure, layouts, SEO shell + JSON-LD/OG defaults, theme modes; page-level Container (ADR-0013); `output: 'static'` + `trailingSlash: 'always'` (ADR-0016) |
| FEAT-CONTENT-001  | Local bilingual articles        | Done   | MS-002    | Content Collections + article routes                                                                                                                                  |
| FEAT-PLATFORM-002 | Bilingual shadcn-vue catalog    | Done   | MS-004    | Public `/components` showcase with Vue island                                                                                                                         |
| FEAT-PLATFORM-003 | Production Astro UI primitives  | Done   | MS-005    | ButtonLink, Card, Badge, Breadcrumbs + `astroVariants`                                                                                                                |
| FEAT-PLATFORM-004 | Header Vue chrome               | Done   | MS-006    | Desktop nav + mobile Sheet; LanguageSwitcher/ThemeToggle/CTA stay in header (`client:load`)                                                                           |
| FEAT-PLATFORM-005 | Governed Astro icon stack       | Done   | MS-007    | `astro-icon` + Iconify packs + `iconDir` (ADR-0011)                                                                                                                   |
| FEAT-PLATFORM-006 | Native MPA view transitions     | Done   | MS-008    | CSS `@view-transition` only — no `ClientRouter` (ADR-0012)                                                                                                            |
| FEAT-PLATFORM-007 | Production GA4 with opt-in      | Done   | MS-009    | `PUBLIC_GOOGLE_ANALYTICS_MODE` default `opt-in` (TADR-0002); CookieConsent + privacy settings; stored `denied` always honored                                         |
| FEAT-PLATFORM-008 | Locale-paired fonts             | Done   | MS-010    | Tajawal for `ar`, Manrope for `en` via Astro Fonts (ADR-0015)                                                                                                         |
| FEAT-PLATFORM-009 | Platform-neutral recipe pack    | Done   | MS-010    | Docs-only recipes for host/security/consent/forms/CMS/header (ADR-0017); npm remains package manager                                                                  |
| FEAT-PLATFORM-010 | Core SEO + layout chrome rename | Done   | MS-011    | BaseHead/StructuredData/FormField; `core/` + `layout/`; Header/Footer/Analytics; `src/data/*` + `src/assets/*` (ADR-0018)                                             |

Related maps: [COMPONENT-MAP](COMPONENT-MAP.md), [ISLAND-MAP](ISLAND-MAP.md), [SCREEN-MAP](SCREEN-MAP.md), [ROUTE-MAP](ROUTE-MAP.md), [DECISIONS](DECISIONS.md), [DECISIONS-INDEX](DECISIONS-INDEX.md).

## FEAT-PLATFORM-003 — Production Astro UI primitives

Description: Ship reusable Astro-first UI primitives and apply them across production chrome and content pages.

Acceptance criteria:

- Typed Astro UI variants exist under `src/lib/ui/astroVariants.ts`
- Production routes use ButtonLink CTAs, Card/Badge article presentation, and Breadcrumbs on articles/catalog paths
- Mirrored `ar`/`en` dictionary keys cover new chrome labels
- Unit and Playwright coverage verify variants/CTAs/breadcrumbs/a11y

Status: Done

Notes: Header explore/mobile navigation originally shipped as Astro `details`/`summary` under this feature; interactive header chrome moved to FEAT-PLATFORM-004 / ADR-0010.

## FEAT-PLATFORM-004 — Header Vue chrome

Description: One HeaderChrome island using a three-zone header (brand, centered NavigationMenu on desktop, trailing actions), LanguageSwitcher + ThemeToggle Selects, CTA, and a mobile Sheet drawer for primary nav, plus noscript fallbacks.

Acceptance criteria:

- Desktop header layout is brand (start) \| primary NavigationMenu (center) \| actions (end)
- Mobile header keeps brand + actions (language, theme, CTA) and opens primary nav via hamburger Sheet
- Mobile Sheet lists Home and an Explore accordion (Articles / Components); drawer uses logical `side="end"` (right in LTR, left in RTL)
- Actions order is language icon Select, theme icon Select, CTA (`xs`), then menu trigger on small viewports
- Theme control uses ui Select (`light` / `dark` / `auto`) with persistence; trigger shows Sun / Moon / Monitor for the current mode
- Language control uses a unified Languages icon Select (not text) that navigates to the alternate locale
- One header island uses `client:load`; BaseLayout keeps pre-paint theme bootstrap
- Noscript fallbacks expose real nav and language links
- RTL/LTR, keyboard, and Playwright coverage pass
- Header island wraps Reka primitives with `RekaLocaleProvider` so `dir` matches the page locale

Status: Done

Risks: Header JS budget growth on every content route — see [PERFORMANCE-BUDGET](PERFORMANCE-BUDGET.md).

## FEAT-PLATFORM-005 — Governed Astro icon stack

Description: Close the icon baseline gap with local `astro-icon` + Iconify data, using `Icon` from `astro-icon/components` and `iconDir` pointed at `src/assets/icons` for project SVG files, without adding client icon runtime.

Acceptance criteria:

- `astro-icon`, `@iconify-json/lucide`, and `@iconify-json/simple-icons` are installed and `icon({ iconDir: 'src/assets/icons' })` is registered in `astro.config.ts`
- Astro surfaces use `Icon` from `astro-icon/components`; Lucide for UI icons, Simple Icons for company/platform logos only
- Local bespoke SVGs live under `src/assets/icons/` (via `iconDir`) only when Iconify collections do not cover the artwork
- `@lucide/vue` remains scoped to `components/ui` and Vue islands — dual stack documented in ADR-0011
- Decorative icons use `aria-hidden`; meaningful icons need an accessible name (`title` / `aria-label`)
- Directional icons are reviewed per use (no blind RTL flip); no Iconify CDN/runtime or icon fonts
- Build resolves local Iconify names with no new hydrated roots or client icon chunks

Status: Done

Notes: Production Astro surfaces (HomeHero, ArticleCard, Callout, Footer, ErrorPage/404/500) and `AstroIconsDemo` on `/components` use `Icon` from `astro-icon`. Vue catalog/header primitives stay on `@lucide/vue`.

## FEAT-PLATFORM-006 — Native MPA view transitions

Description: Opt in to browser-native cross-document View Transitions for same-origin navigations while keeping the site a static multi-page app (no Astro `ClientRouter`, no new client JS).

Acceptance criteria:

- Shared CSS opts in with `@view-transition { navigation: auto; }` and a short root crossfade
- Transitions are disabled under `prefers-reduced-motion: reduce`
- No `ClientRouter`, `transition:persist`, or Astro transition lifecycle listeners
- Theme bootstrap, Vue islands, `lang`/`dir`, and SEO head continue to work via full document navigation
- Unsupported browsers keep ordinary full-page navigation with no extra fallback JS
- Playwright covers opt-in CSS presence, locale/theme navigation, and reduced-motion navigation
- Client JS / hydration budgets are unchanged (zero-JS feature)

Status: Done

Notes: See ADR-0012. Feeds and sitemap remain outside HTML layout CSS.

## FEAT-PLATFORM-007 — Production Google Analytics 4 with analytics mode

Description: Ship production-only Google Analytics 4 via Measurement ID, with enable/disable and `PUBLIC_GOOGLE_ANALYTICS_MODE` (`off` | `opt-out` | `opt-in`, default `opt-in`), plus bilingual CookieConsent and footer privacy settings. Default opt-in does not load GA before grant; stored denial is always honored.

Acceptance criteria:

- `PUBLIC_GOOGLE_ANALYTICS_ID`, `PUBLIC_GOOGLE_ANALYTICS_ENABLED` (default `true`), and `PUBLIC_GOOGLE_ANALYTICS_MODE` (default `opt-in`) are registered as public client env fields
- `Analytics` loads official `gtag.js` when `import.meta.env.PROD`, the ID matches `G-…`, enabled is not `false`, mode is not `off`, and `mayLoadAnalytics` allows load for the mode/preference pair
- Opt-in (default): load only when stored preference is `granted`
- Opt-out: unset preference and accept allow loading (may load before first choice); reject persists versioned `{ state: 'denied', version: 1 }` and stops further injection after reload; reject cannot retract already-sent pageviews
- Off: never load and hide preference UI
- Stored `denied` is always honored; hiding preference UI must not ignore denial
- Development, unset ID, invalid IDs, `mode=off`, and explicit disable emit zero analytics scripts
- CookieConsent preference UI shows when analytics is enabled and mode is not `off` (even without an ID); first-visit banner auto-opens only when a production-valid ID can load; footer `data-privacy-settings` reopens it
- No analytics npm package; MPA full document loads provide page views without navigation listeners
- Unit coverage validates mode/preference helpers; Playwright asserts scripts absent when unset

Status: Done

Notes: See ADR-0014 (modes) and TADR-0002 (default opt-in + `PUBLIC_SITE_URL`). Consent Mode v2 defaults remain optional in `docs/recipes/consent-aware-analytics.md`.

## FEAT-PLATFORM-008 — Locale-paired fonts (Tajawal + Manrope)

Description: Self-host Tajawal for Arabic pages and Manrope for English pages through the Astro Fonts API, selectively preloading weight 400 + locale subset for the active family only.

Acceptance criteria:

- Tajawal (`--font-tajawal`) and Manrope (`--font-manrope`) are registered in `astro.config.ts`
- `BaseHead` preloads only the locale-appropriate family with weight `400` and the locale subset (`arabic` / `latin`) — not a boolean preload of all variants
- `html[lang]` maps `--font-document` so `font-sans` follows the page language
- No Google Fonts CDN `@import`
- Docs and performance budget describe one critical family per page; fonts are locally served build assets (no guaranteed `/_astro/fonts` path)

Status: Done

Notes: See ADR-0015 (amended). Further font swaps use the font customization recipe.

## FEAT-PLATFORM-009 — Platform-neutral recipe pack

Description: Document opt-in adoption paths for host redirects/security, consent-aware analytics, marketing/legal pages, Organization JSON-LD, contact forms, CMS, and Astro-only header without expanding baseline runtime.

Acceptance criteria:

- Recipe index exists under `docs/recipes/`
- Recipes cover routing/host, security/cache, runtime choice, CMS, consent, marketing/org, portfolio/Person, cleanup, favicons, content gates, analytics events, contact form, and Astro-only header
- Dependency-bearing steps require Integrations proposal in adopting projects
- npm remains the package manager; no host config files committed in baseline

Status: Done

Notes: See ADR-0017.

## FEAT-PLATFORM-010 — Core SEO layer and layout chrome rename

Description: Extract reusable BaseHead/StructuredData, rename header/footer/analytics chrome to checklist names, add FormField and centralized `src/data` + `src/assets` folders, and document structure overrides.

Acceptance criteria:

- `BaseHead` owns SEO/meta/font preload; `StructuredData` renders JSON-LD; `BaseLayout` composes them
- `Header` / `Footer` / `Analytics` / `HeaderChrome` replace prior Site* / GoogleAnalytics names under `components/core` and `components/layout`
- `FormField.astro`, `src/data/{site,navigation,social}.ts`, and `src/assets/{images,icons,fonts}/` exist
- `prefetch` `{ prefetchAll: false, defaultStrategy: 'viewport' }` + `devToolbar` are explicit; primary nav and high-confidence CTAs opt in via `data-astro-prefetch` / ButtonLink `prefetch`
- `prefixDefaultLocale` remains `true`; `src/assets/icons` is `astro-icon` `iconDir`
- Docs/maps/overrides updated (ADR-0018)

Status: Done

Notes: See ADR-0018. Structure and consent rules are reflected in managed standards under `docs/standards/astro/`.

## Marketing checklist alignment (sections 8–13)

Baseline status versus the marketing-site checklist. Intentional exceptions: **ADR-0019**.

| Section              | Status                            | Notes                                                                                                                                                    |
| -------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8. JS / interactive  | Done (with ADR-0010 exception)    | Native scripts for theme/consent/analytics; Vue only for HeaderChrome + catalog; hydration `idle`/`load`; no `ClientRouter`; CSS View Transitions        |
| 9. Prefetch          | Done                              | `prefetchAll: false`, `defaultStrategy: 'viewport'`; opt-in via `data-astro-prefetch` on primary nav + high-confidence CTAs (ADR-0018)                   |
| 10. Arabic / English | Done (with documented exceptions) | `lang`/`dir`, logical CSS, dictionaries + content collections, hreflang; LanguageSwitcher Select + noscript links; `x-default` → `/ar/`                  |
| 11. Dark mode        | Done                              | `color-scheme`, localStorage, `prefers-color-scheme`, pre-paint script, semantic tokens (+ `success`/`warning`/`danger`/`info`), `theme-color`           |
| 12. Accessibility    | Done (baseline)                   | Skip link, landmarks, h1, focus, `aria-expanded`, `aria-current` on nav, reduced-motion (VT + scroll), axe e2e; touch targets improved on header/consent |
| 13. Forms            | Recipe / scaffold only            | No production contact route; `FormField` + catalog demo + [contact-form.md](../recipes/contact-form.md)                                                  |

## Marketing checklist alignment (sections 14–19)

Baseline status versus the marketing-site checklist. Intentional exceptions: **ADR-0020** (amended by TADR-0002 for opt-in default).

| Section                   | Status                   | Notes                                                                                                                                                                                                                                                          |
| ------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14. Environment variables | Done (baseline)          | Astro `env.schema` for `PUBLIC_*`; build-time `PUBLIC_SITE_URL` via `loadEnv` + `resolveSiteUrl` (TADR-0002); `.env.example` + gitignore; no SMTP/Sentry/contact secrets without matching features                                                             |
| 15. Security              | Recipe / host            | Host headers/CSP via [security-cache-and-csp.md](../recipes/security-cache-and-csp.md); Astro-native `security.csp` deferred (ADR-0020); no host config in repo (ADR-0017); baseline does not claim CSP-compliant; SSR CSRF/cookies N/A for `output: 'static'` |
| 16. Analytics / privacy   | Done                     | **Keep** `Analytics` + CookieConsent + GA4; default mode **`opt-in`** (TADR-0002) — no load before grant; `opt-out` remains available; Consent Mode v2 = recipe; ops tools adopter-owned                                                                       |
| 17. TypeScript            | Done                     | `astro/tsconfigs/strictest`, `@/*`, `check` + `vue-tsc` via `validate` / CI; `build` is artifact-only (TADR-0002)                                                                                                                                              |
| 18. Code formatting       | Done (core)              | Prettier (Astro + Tailwind last) + ESLint + `.editorconfig`; `fix:format` / `fix:lint` mutators; no Husky/lint-staged/commitlint/Stylelint by default                                                                                                          |
| 19. Testing               | Done (baseline Chromium) | Playwright: core HTTP 200, nav, i18n, theme, mobile nav, viewport/RTL overflow, 404, SEO, lang/dir, single h1, console guards; no production contact-form e2e; Firefox/WebKit/visual = release strategy                                                        |

## Marketing checklist alignment (sections 20–21)

Baseline status versus the marketing-site checklist. Intentional exceptions: **ADR-0021** (npm vs pnpm; budget/links vs Lighthouse CI; deploy/preview host-owned).

| Section                 | Status                            | Notes                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20. CI/CD               | Done (with documented exceptions) | GitHub Actions **`workflow_dispatch` only** (no auto push/PR): `npm ci` → format → lint → check → vue-tsc → unit → **build once** → `verify:budget` → `verify:links` → `verify:e2e` → upload `static-dist` (14-day retention); concurrency cancel-in-progress; `.nvmrc` `24` + `engines` `>=24 <25`; **keep npm**; no deploy/preview workflow (ADR-0021 / TADR-0001 / TADR-0002); local/PR gates via `ci:local` |
| 21. Caching and hosting | Recipe / host                     | Cache-Control for `/_astro/*` + HTML, compression, TLS, canonical host, trailing-slash + directory host contract via recipes/DEPLOYMENT (ADR-0016/0017); custom `404.astro` + `500.astro` in baseline; old-URL permanent redirect maps and uptime = adopter when replacing a live site                                                                                                                          |

## Milestones (template)

| Milestone | Feature IDs                          | Summary                                    |
| --------- | ------------------------------------ | ------------------------------------------ |
| MS-001    | FEAT-PLATFORM-001                    | Governed static bilingual shell            |
| MS-002    | FEAT-CONTENT-001                     | Local articles + MDX allowlist             |
| MS-003    | FEAT-PLATFORM-001                    | Theme modes + quality gates                |
| MS-004    | FEAT-PLATFORM-002                    | Public component catalog                   |
| MS-005    | FEAT-PLATFORM-003                    | Astro UI kit on production pages           |
| MS-006    | FEAT-PLATFORM-004                    | HeaderChrome desktop nav + mobile Sheet    |
| MS-007    | FEAT-PLATFORM-005                    | Governed astro-icon stack + `iconDir`      |
| MS-008    | FEAT-PLATFORM-006                    | Native CSS cross-document view transitions |
| MS-009    | FEAT-PLATFORM-007                    | Production GA4 with opt-in consent         |
| MS-010    | FEAT-PLATFORM-008, FEAT-PLATFORM-009 | Locale fonts + platform-neutral recipes    |
| MS-011    | FEAT-PLATFORM-010                    | Core SEO + layout chrome rename            |
