# Template Astro Decisions

Architecture decisions for this Astro **template starter**.

Template maintainers record new starter decisions here (and mirror consequences in the relevant `docs/astro/*` maps).
Adopting projects record **product** ADRs in `docs/system/DECISIONS.md`.

Bootstrap ADRs from the 1.0.0 starter (ADR-0001–ADR-0008) remain in `docs/system/DECISIONS.md` as the filled example snapshot shipped with the template.

Index: [DECISIONS-INDEX.md](DECISIONS-INDEX.md).

### Decision ID namespace

- **New template decisions** use `TADR-####` (see TADR-0001).
- **Historical template entries** keep their existing `ADR-0009`–`ADR-0021` numbers; do not renumber them.
- **Adopting-product decisions** continue as `ADR-####` in `docs/system/DECISIONS.md`.

## ADR-0009 — Astro-first production UI primitives

Date: 2026-07-27

Status: Accepted (scope exception: Header chrome → ADR-0010; Astro primitives remain)

Context: Production pages still used ad-hoc HTML for CTAs, cards, and navigation while interactive shadcn-vue primitives remained catalog-only. Teams need reusable production UI without expanding hydration by default.

Decision:

- Build production UI primitives as Astro components under `src/components/astro/**`
- Share typed class variants via `src/lib/ui/astroVariants.ts` (CVA + existing tokens/`cn`)
- Keep catalog as the Vue showcase surface (ADR-0008); do not hydrate Vue for ButtonLink/Card/Badge/Breadcrumbs

Alternatives considered:

- Port SiteHeader to Vue NavigationMenu/Sheet islands immediately
- Duplicate ad-hoc Tailwind classes per page without shared variants

Consequences:

- Visual alignment with shadcn tokens without importing Vue primitives into every Astro surface
- Header interactive chrome is owned by ADR-0010 (`HeaderChrome`); Astro ButtonLink/Card/Badge/Breadcrumbs remain under this ADR
- Do not replace `HeaderChrome` with an Astro-only header in baseline; that path stays a recipe

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, ISLAND-MAP, PERFORMANCE-BUDGET, TEMPLATE-CHANGELOG, recipes/astro-only-header.md

Follow-up: None for Astro primitives; header NavigationMenu + theme Select remain under ADR-0010

## ADR-0010 — Approve Header Vue chrome (NavigationMenu + Select)

Date: 2026-07-27

Status: Accepted

Context: Production chrome needs interactive shadcn-vue NavigationMenu and Select for theme preference. ADR-0009 kept header island-free with `details`/`summary` and link-based language switching.

Decision:

- Add one cohesive `HeaderChrome` Vue island hydrated with `client:load`
- Use a three-zone header: brand (start), `NavigationMenu` (center, desktop), actions (end)
- On small viewports, hide inline `NavigationMenu` and open the same destinations from a Sheet drawer (hamburger); keep language, theme, and CTA visible in the header bar
- Actions order: language icon Select, theme icon Select (`light` / `dark` / `auto`, icon reflects mode), CTA (`xs`), then menu trigger (mobile only)
- Provide `<noscript>` real-link fallbacks for nav and language
- Keep BaseLayout pre-paint theme bootstrap; do not expand Vue beyond this header chrome island and the catalog island without a further ADR

Alternatives considered:

- Keep Astro disclosures only (ADR-0009)
- Separate islands for language and navigation
- NavigationMenu-only chrome with no mobile Sheet (rejected — cramped on narrow viewports)

Consequences:

- Content routes gain one hydrated root for header chrome; performance budget documents header JS separately from catalog
- Feature ID FEAT-PLATFORM-004 / MS-006
- Playwright coverage must exercise Select, desktop NavigationMenu, and mobile Sheet/Collapsible interactions

Affected docs: FEATURE-BASELINE, ISLAND-MAP, COMPONENT-MAP, PERFORMANCE-BUDGET, SCREEN-MAP, TEMPLATE-CHANGELOG

Follow-up: Remeasure header chrome client JS after dependency changes

## ADR-0011 — Adopt astro-icon stack for Astro surfaces

Date: 2026-07-28

Status: Accepted

Context: Managed standards require `astro-icon` with local `@iconify-json/lucide` and `@iconify-json/simple-icons` for Astro UI. The template previously shipped only `@lucide/vue` for shadcn-vue islands, and the empty `components/icons` placeholder had been removed. Astro production surfaces lacked a governed icon path.

Decision:

- Install `astro-icon`, `@iconify-json/lucide`, and `@iconify-json/simple-icons` as the pre-approved Astro icon baseline
- Register `icon({ iconDir: 'src/assets/icons' })` in `astro.config.ts` (overrides default `src/icons/`)
- Use `Icon` from `astro-icon/components` directly on Astro surfaces — no project wrapper component
- Keep bespoke trusted SVG files under `src/assets/icons/` only when approved Iconify collections do not provide the artwork
- Keep `@lucide/vue` scoped to `components/ui` and Vue islands (dual stack)
- Do not add Iconify CDN/runtime packages, icon fonts, or additional collections without a dependency exception

Alternatives considered:

- Custom `UIcon.astro` wrapper around `astro-icon`
- Icon fonts or CDN Iconify runtime fetching
- Duplicating Lucide artwork as local SVG components
- Replacing `@lucide/vue` in shadcn-vue primitives with Astro icons (incompatible with Vue SFCs)

Consequences:

- Astro icons inline as build-time SVG with zero client icon runtime and no new hydrated roots
- Dual icon stack is documented: Astro via `astro-icon` `Icon` + `iconDir`; Vue via `@lucide/vue`
- Feature ID FEAT-PLATFORM-005 / MS-007
- Decorative icons use `aria-hidden`; meaningful icons need `title` / `aria-label`
- Directional icons need per-use RTL review (no automatic flip)

Affected docs: FEATURE-BASELINE, DEPENDENCY-REGISTER, COMPONENT-MAP, PERFORMANCE-BUDGET, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, STRUCTURE, INTEGRATIONS, CONTRIBUTING, Cursor components rule

Follow-up: Expand Iconify collections only via dependency exception; do not migrate Vue Lucide usage without a further ADR

### Amendment — 2026-07-31

Previous: `iconDir: 'src/components/icons'` and local SVGs under `src/components/icons/`.

New: `iconDir: 'src/assets/icons'`; local SVGs live under `src/assets/icons/` (with a folder README). Vue icons remain `@lucide/vue`.

Reason: Align local icon sources with `src/assets/*` asset ownership; avoid a parallel `components/icons` tree for `astro-icon`.

Migration: Move any project SVGs from `src/components/icons/` to `src/assets/icons/` and update `astro.config.ts` `iconDir`.

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, DEPENDENCY-REGISTER, TEMPLATE-VERSION, TEMPLATE-CHANGELOG, README, STRUCTURE, INTEGRATIONS, CONTRIBUTING, `.cursor/rules/astro/astro-components-islands.md`

## ADR-0012 — Native MPA view transitions (no ClientRouter)

Date: 2026-07-29

Status: Accepted

Context: Astro documents both browser-native cross-document View Transitions and the SPA-mode `<ClientRouter />`. Managed standards reject client routers for ordinary website navigation. The template already relies on full document loads for theme bootstrap and Vue island remounts.

Decision:

- Opt in site-wide with CSS `@view-transition { navigation: auto; }` imported from `src/styles/view-transitions.css` via `global.css`
- Use a short root crossfade only; do not add Astro `ClientRouter`, `transition:*` directives, or SPA lifecycle re-init
- Disable view-transition animations under `prefers-reduced-motion: reduce`
- Keep unsupported browsers on ordinary full-page navigation (no fallback JS)

Alternatives considered:

- Astro `<ClientRouter />` SPA mode with `transition:persist` on header chrome — rejected for this milestone because it adds client routing JS, conflicts with the default rejection of client routers, and requires theme/`astro:after-swap` re-init
- Per-page opt-in only — rejected; shared layout CSS already covers all HTML routes consistently
- Custom named transitions / slide animations — deferred; start with the browser default root crossfade

Consequences:

- Feature ID FEAT-PLATFORM-006 / MS-008
- Zero additional hydrated roots or router chunks; PERFORMANCE-BUDGET unchanged for JS
- Theme script and islands continue to initialize on each document load
- Richer SPA features (`transition:persist`, `navigate()`, simulated fallbacks) remain available only if a future ADR revisits `ClientRouter`

Affected docs: FEATURE-BASELINE, RENDERING-MATRIX, ROUTE-MAP, PERFORMANCE-BUDGET, TEMPLATE-CHANGELOG, TEMPLATE-VERSION

Follow-up: Revisit `ClientRouter` only if product requirements need persistent islands or same-document routing beyond native MPA transitions

## ADR-0013 — Page-level Container ownership (full-bleed sections)

Date: 2026-07-29

Status: Accepted

Context: Wrapping all page content in `Container` inside `WebsiteLayout` prevented full-bleed section backgrounds while keeping inner content centered. Marketing-style pages often need edge-to-edge section surfaces with constrained content.

Decision:

- Keep `WebsiteLayout` `<main>` full-bleed (chrome only: header, main slot, footer)
- Own `Container` at page or section composition: wrap constrained content inside each section/page, not the site layout
- Keep `Container` inside header/footer chrome and inside `ContentLayout` for the article reading column
- Pattern for banded sections: outer full-width `<section>` (background) → inner `Container` (content)

Alternatives considered:

- Keep a single layout-level `Container` — rejected; blocks full-bleed bands
- Add a separate `FullBleed` layout prop — rejected; page/section ownership is simpler and explicit

Consequences:

- Home sections (`HomeHero`, `HomeArticles`) and ordinary pages wrap their own `Container`
- Adopting projects can add full-width backgrounds without layout changes
- Feature ID FEAT-PLATFORM-001 (layout composition refinement)

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, SCREEN-MAP, TEMPLATE-CHANGELOG

Follow-up: None

## ADR-0014 — Production GA4 with analytics mode and disable path

Date: 2026-07-29

Status: Accepted (amended 2026-07-31)

Context: Adopting projects often need Google Analytics 4 on static content sites. Teams need an official-snippet integration that is configurable in production when a Measurement ID is set, with an explicit disable switch, without hydrating islands or polluting local/dev traffic, and with an honest privacy preference UI.

Decision:

- Support GA4 with the official `gtag.js` snippet only (no analytics npm SDK)
- Resolve injection in production builds when `PUBLIC_GOOGLE_ANALYTICS_ID` is a valid `G-…` ID **and** `PUBLIC_GOOGLE_ANALYTICS_ENABLED` is not explicitly `false` (default `true`) **and** `PUBLIC_GOOGLE_ANALYTICS_MODE` is not `off`
- `PUBLIC_GOOGLE_ANALYTICS_MODE`: `off` | `opt-out` | `opt-in` (default `opt-out`). Invalid values fall back to `opt-out`
- Leaving the Measurement ID unset disables analytics (no ID → no scripts / no preference UI)
- Mount `Analytics` from `BaseHead` (composed by `BaseLayout`)
- **opt-out (default):** GA may load when configured unless stored preference is `denied` (may load before first choice). Reject cannot retract already-sent pageviews
- **opt-in:** GA must not load until stored preference is `granted`
- **off:** never inject GA; do not show analytics preference UI
- Stored `denied` is **always** honored when a mode allows analytics; hiding the preference UI must not ignore a stored denial
- Persist a versioned non-PII preference JSON `{ state: 'granted'|'denied', version: 1 }` in `localStorage` at key `analytics-consent` (legacy plain `granted`/`denied` strings still parse)
- Footer privacy-settings control (`data-privacy-settings`) reopens CookieConsent when preference UI is available
- Rely on MPA full document navigation for page views; do not add SPA-style route listeners
- Keep `astro dev` analytics-free (production gate only)
- Do **not** describe default opt-out behavior as a “consent gate”
- Consent Mode v2 defaults remain optional via recipe when legal scope needs them

Alternatives considered:

- Install `partytown` or an analytics SDK — rejected; adds dependency surface for an optional feature
- Always inject when the env var is set, including `astro dev` — rejected; pollutes local traffic and complicates tests
- Zero-by-default product stance with no enable flag — superseded; product default is on when configured, with explicit disable
- Keep preference UI recipe-only — superseded 2026-07-31; baseline ships CookieConsent
- `PUBLIC_ANALYTICS_CONSENT_REQUIRED` hide-banner-and-ignore-denial — removed; mode + always-honor-denial replaces it
- Opt-in as the only baseline mode — rejected; default remains honest opt-out with optional `opt-in` / `off`

Consequences:

- Feature ID FEAT-PLATFORM-007 / MS-009
- Default opt-out may send hits before the visitor chooses; CookieConsent and footer privacy settings let visitors accept or reject further collection
- Unset ID or `mode=off` keeps third-party scripts and the preference UI out

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, RENDERING-MATRIX, PERFORMANCE-BUDGET, API-USAGE, DEPENDENCY-REGISTER, DEPLOYMENT, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, recipes/consent-aware-analytics.md, ANALYTICS-AND-THIRD-PARTY, SECURITY-AND-PRIVACY, PERFORMANCE-AND-BUDGETS, INTEGRATIONS, Cursor security rule

Follow-up: Optional Consent Mode v2 defaults via `docs/recipes/consent-aware-analytics.md` when required

### Amendment — 2026-07-31 (analytics modes)

Previous: Framed as a “consent gate”; `PUBLIC_ANALYTICS_CONSENT_REQUIRED` could hide the banner and ignore opt-out storage; preference stored as plain `granted`/`denied`.

New: `PUBLIC_GOOGLE_ANALYTICS_MODE` (`off` | `opt-out` | `opt-in`, default `opt-out`); versioned preference JSON; stored denial always honored; footer `data-privacy-settings` reopens CookieConsent; do not call default opt-out a consent gate.

Reason: Match implemented load policy honestly and remove the ignore-denial escape hatch.

Migration: Remove `PUBLIC_ANALYTICS_CONSENT_REQUIRED`. Prefer `PUBLIC_GOOGLE_ANALYTICS_MODE`. For stricter pre-load blocking use `opt-in` or the consent-aware recipe.

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, RENDERING-MATRIX, PERFORMANCE-BUDGET, API-USAGE, DEPLOYMENT, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, `.env.example`, recipes/consent-aware-analytics.md, ANALYTICS-AND-THIRD-PARTY, SECURITY-AND-PRIVACY, PERFORMANCE-AND-BUDGETS, INTEGRATIONS, `.cursor/rules/astro/astro-security.md`

## ADR-0015 — Locale-paired Astro Fonts (Tajawal + Manrope)

Date: 2026-07-29

Status: Accepted (amended 2026-07-31)

Context: Bilingual `ar`/`en` sites need an Arabic-capable family and a complementary Latin family. The Astro Fonts API self-hosts provider fonts with selective preload and optimized fallbacks. A single Tajawal stack for both locales under-served English typography.

Decision:

- Register Tajawal via `fontProviders.google()` (`--font-tajawal`, subsets `arabic` + `latin`, weights `400` / `500` / `700`)
- Register Manrope via `fontProviders.google()` (`--font-manrope`, subset `latin`, weights `400` / `500` / `700`)
- In `BaseHead`, preload only the active locale family with a selective preload list — weight `400`, locale subset only (`ar` → Tajawal/`arabic`, `en` → Manrope/`latin`). Do not pass a boolean `preload` that pulls all registered variants
- Map document sans through `--font-document` on `html[lang]` so Arabic uses Tajawal and English uses Manrope
- Do not use Google Fonts CSS CDN `@import`
- Treat fonts as locally served build assets; do **not** guarantee a public URL path such as `/_astro/fonts`

Alternatives considered:

- Single Tajawal family for both locales — rejected for English reading comfort
- Geist Sans via Fontsource — superseded; Manrope chosen as the English baseline
- Keep Google Fonts CSS CDN — rejected; third-party request and no Astro fallback optimization
- Local font files under `src/assets/fonts/` — deferred; providers are enough for the starter
- Boolean `preload` for all weights/subsets — rejected; critical path should preload body weight + locale subset only

Consequences:

- Fonts are downloaded/cached by Astro and emitted as site-owned build assets (exact hashed path is build-dependent)
- Performance budget allows one critical preloaded family per page (locale-specific, weight 400)
- Feature ID FEAT-PLATFORM-001 refinement / FEAT-PLATFORM-008

Affected docs: FEATURE-BASELINE, PERFORMANCE-BUDGET, TEMPLATE-CHANGELOG, COMPONENT-MAP, I18N-MAP, STYLING, I18N-AND-SEO, PERFORMANCE-AND-BUDGETS, recipes/font-customization.md, recipes/security-cache-and-csp.md

Follow-up: Font customization recipe for adopting projects that need different families

### Amendment — 2026-07-31

Previous: Documented preload of the active locale family; consequences claimed fonts are served from `_astro/fonts`.

New: Selective preload (`weight: 400` + locale subset only); fonts described as locally served build assets without a guaranteed `/_astro/fonts` path.

Reason: Match `BaseHead` preload lists and avoid brittle CSP/docs that assume a fixed font URL prefix.

Migration: Update any adopting CSP or docs that hard-code `/_astro/fonts`; prefer `font-src 'self'` (or measured hashed paths).

Affected docs: FEATURE-BASELINE, PERFORMANCE-BUDGET, COMPONENT-MAP, I18N-MAP, STYLING, PERFORMANCE-AND-BUDGETS, recipes/font-customization.md, recipes/security-cache-and-csp.md

## ADR-0016 — Explicit static output and trailing-slash URLs

Date: 2026-07-29

Status: Accepted (amended 2026-07-31)

Context: The starter needs an explicit static output mode and a single trailing-slash policy aligned with `localizePath`, canonicals, sitemap, and directory build output.

Decision:

- Set `output: 'static'` explicitly in `astro.config.ts` (no adapter in baseline)
- Set `trailingSlash: 'always'` so canonical links and routing prefer URLs with a trailing slash
- Set `build.format: 'directory'` for `dist/.../index.html` file layout
- **Host contract (platform-neutral):** the host must serve `/about/` from `/about/index.html` and permanently redirect `/about` → `/about/` (and the same pattern for locale routes). Do not commit vendor host files (`vercel.json`, `netlify.toml`, `_headers`) in the template root
- Document trailing-slash routes and the host contract in ROUTE-MAP, I18N-MAP, SCREEN-MAP, DEPLOYMENT, and the routing recipe

Alternatives considered:

- `trailingSlash: 'never'` with directory format — previously tried; superseded by the 2026-07-31 amendment restoring `always`
- Switch `build.format` to `'file'` (`page.html`) — deferred; not required for trailing-slash URL policy on typical static hosts
- Commit a single-vendor redirect file in baseline — rejected; host-neutral stance (ADR-0017)

Consequences:

- Docs and hosts must treat `/ar/`, `/ar/articles/`, etc. as canonical
- Deploy hosts must not force slashless redirects that contradict this policy
- Correct behavior depends on host rewrite/redirect configuration, not Astro alone

Affected docs: ROUTE-MAP, I18N-MAP, SCREEN-MAP, ISLAND-MAP, RENDERING-MATRIX, PERFORMANCE-BUDGET, DEPLOYMENT, TEMPLATE-CHANGELOG, recipes/routing-and-host-redirects.md

Follow-up: Verify the host contract on each adopting project's deployed host (directory index + 301 slashless → trailing slash). Not marked complete until that check is done for the target platform.

### Amendment — 2026-07-31 (host contract for slashless)

Previous: Documented slashless URLs and directory format; Follow-up was “None”.

New: Explicit host contract for directory + slashless URLs; Follow-up requires deployed-host verification; platform-neutral (no vendor config in template).

Reason: Slashless public URLs with `build.format: 'directory'` only work when the host serves `index.html` at the slashless path and redirects trailing-slash duplicates.

Migration: (Superseded by the trailing-slash amendment below.)

Affected docs: ROUTE-MAP, DEPLOYMENT, recipes/routing-and-host-redirects.md, TEMPLATE-CHANGELOG

### Amendment — 2026-07-31 (restore trailingSlash: always)

Previous: `trailingSlash: 'never'`; slashless public URLs (`/ar`, `/ar/articles`); host redirected `/path/` → `/path`.

New: `trailingSlash: 'always'`; public URLs keep a trailing slash (`/ar/`, `/ar/articles/`); `localizePath` and root redirect (`/ar/`) aligned; host redirects `/path` → `/path/`.

Reason: Product preference for trailing-slash canonicals with directory-format static output (natural fit for `…/index.html`).

Migration: Update internal links, canonicals, sitemap expectations, Playwright/unit helpers, and host redirects. Configure per [routing-and-host-redirects.md](../recipes/routing-and-host-redirects.md); smoke-test `/about` and `/about/` after deploy.

Affected docs: ROUTE-MAP, I18N-MAP, SCREEN-MAP, RENDERING-MATRIX, DEPLOYMENT, FEATURE-BASELINE, README, I18N-AND-SEO, recipes/routing-and-host-redirects.md, TEMPLATE-CHANGELOG

## ADR-0017 — Opt-in recipe pack (platform-neutral)

Date: 2026-07-29

Status: Accepted

Context: Adopting projects repeatedly need host redirects, security/cache headers, consent-aware analytics, marketing/legal pages, Organization JSON-LD, contact forms, CMS integration, and optional Astro-only header alternatives. Shipping these as baseline runtime would couple the template to a host, invent legal/org data, or expand hydration without a product requirement.

Decision:

- Keep baseline static-first, npm-managed, no adapter/CMS SDK/ClientRouter/host config files in the repository root
- Bilingual CookieConsent + mode-aware GA ships in baseline (ADR-0014 amendment; default opt-out); recipe covers Consent Mode v2 and project-specific privacy links
- Ship remaining guidance as `docs/recipes/*` with clear entry conditions, affected files, and acceptance checks
- Dependency-bearing recipes require an Integrations proposal (and ADR/TADR when substantial) in the adopting project before install
- Do not maintain parallel baseline implementations (e.g. Vue header + Astro-only header both active); keep HeaderChrome in baseline (ADR-0010)

Alternatives considered:

- Commit Netlify/Vercel/Cloudflare config in baseline — rejected; breaks host-neutral stance
- Bundle contact backend + CMS SDKs — rejected; no contracts/design in starter
- Replace Vue header in baseline without superseding ADR-0010 — rejected

Consequences:

- Feature ID FEAT-PLATFORM-009 / MS-010
- Template stays lean; adopters copy recipes deliberately
- npm remains the package manager (`package-lock.json` + `npm ci`)

Affected docs: FEATURE-BASELINE, DEPENDENCY-REGISTER, DEPLOYMENT, README, TEMPLATE-CHANGELOG, recipes index

Follow-up: Expand recipes as adopter demand appears; revisit TD-002 when Astro upgrades `redirectToDefaultLocale`

## ADR-0018 — Core SEO components and layout chrome rename

Date: 2026-07-31

Status: Accepted

Context: Marketing checklist alignment calls for reusable `BaseHead`, `StructuredData`, `Analytics`, `CookieConsent`, `Header`, `Footer`, `LanguageSwitcher`, `ThemeToggle`, and `FormField`, plus `src/data/*` and `src/assets/*`. The starter previously inlined SEO in `BaseLayout` and used `SiteHeader` / `SiteFooter` / `GoogleAnalytics` under `components/astro/layout/`.

Decision:

- Extract `BaseHead` + `StructuredData` under `src/components/core/`
- Rename chrome to `Header` / `Footer` / `Analytics` / `HeaderChrome` under `components/layout/` and `components/core/`
- Extract `LanguageSwitcher` and `ThemeToggle` as child Vue components of `HeaderChrome`
- Add `FormField.astro`, `src/data/{site,navigation,social}.ts`, and `src/assets/{images,icons,fonts}/` (icons folder is also `astro-icon` `iconDir`)
- Keep `prefixDefaultLocale: true`, `trailingSlash: 'always'`, and `site` via build-time public origin env (`PUBLIC_SITE_URL` as of TADR-0002; historical drafts used `SITE_URL`)
- Set explicit `prefetch` `{ prefetchAll: false, defaultStrategy: 'viewport' }` and `devToolbar.enabled: true`
- Prefetch applies only to links that opt in with `data-astro-prefetch` (or ButtonLink `prefetch` prop). Baseline opts in primary nav (HeaderChrome / noscript Header links) and high-confidence CTAs — not every internal link
- Update managed standards (`STRUCTURE`, `COMPONENTS`, analytics/security/i18n guides) so `core/` + `layout/` and baseline CookieConsent are canonical — not project overrides

Alternatives considered:

- Keep Site* names and only document checklist aliases — rejected; product asked for checklist names
- Unprefix default locale (`prefixDefaultLocale: false`) — rejected; confirmed keep `/ar/` and `/en/`
- Hardcode `site: 'https://quanizon.com'` — rejected; keep env-driven origin for the template (`PUBLIC_SITE_URL` as of TADR-0002)
- Keep divergences only in `PROJECT-OVERRIDES.md` — superseded; standards were updated and the overrides file removed
- `prefetchAll: true` — rejected; prefer explicit opt-in on high-confidence destinations

Consequences:

- Feature ID FEAT-PLATFORM-010 / MS-011
- Content/sections remain under `components/astro/{content,sections}`; shadcn stays under `components/ui/`
- Local SVGs for Astro icons live under `src/assets/icons` (ADR-0011 amendment)

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, ISLAND-MAP, DEPLOYMENT, PERFORMANCE-BUDGET, ROUTE-MAP, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, `docs/standards/astro/*`

Follow-up: None

### Amendment — 2026-07-31

Previous: Prefetch described as config-only (`viewport`); `src/assets/icons` listed without tying it to `iconDir`.

New: Document opt-in `data-astro-prefetch` on primary nav + high-confidence CTAs; `iconDir` path is `src/assets/icons` (see ADR-0011 amendment).

Reason: Astro’s `defaultStrategy` does not prefetch every link; baseline intentionally opts in selected destinations.

Migration: Add `data-astro-prefetch` (or ButtonLink `prefetch`) only for destinations that should prefetch; do not assume all `<a>` tags prefetch.

Affected docs: FEATURE-BASELINE, COMPONENT-MAP, PERFORMANCE-BUDGET, ROUTE-MAP, TEMPLATE-CHANGELOG, README

## ADR-0019 — Marketing checklist 8–13 alignment (keep intentional exceptions)

Date: 2026-07-31

Status: Accepted

Context: A marketing-site checklist (JS/islands, prefetch, i18n, dark mode, accessibility, forms) was compared to the starter. Most items already ship. A few checklist lines conflict with accepted ADRs; adopting projects need a clear “Done / exception / recipe” map without a large rewrite.

Decision:

- Keep HeaderChrome Vue + `client:load` (ADR-0010); Astro-only header remains a recipe
- Keep LanguageSwitcher as Select + noscript links (cohesive with ThemeToggle); document as intentional vs link-only guidance
- Keep production contact/lead forms out of baseline (ADR-0017); `FormField` stays a scaffold with `control` slot props for aria wiring; recipe covers server validation / honeypot / endpoints
- Keep `x-default` → default-locale home `/ar/` as template SEO policy
- Keep prefetch `{ prefetchAll: false, defaultStrategy: 'viewport' }` with opt-in `data-astro-prefetch` on primary nav / high-confidence CTAs (ADR-0018 amendment) and CSS-only View Transitions (no `ClientRouter`)
- Close clear gaps: `aria-current="page"` on primary nav, `prefers-reduced-motion` disables smooth scroll, header/consent touch targets, `success`/`warning` tokens, ButtonLink semantic primary colors, SCREEN-MAP / recipes README accuracy

Alternatives considered:

- Replace header with Astro-only native JS — rejected for baseline; recipe already exists; HeaderChrome remains (ADR-0010)
- Ship a production contact form + Actions — rejected; static host-neutral baseline
- Force link-only language switcher — rejected; breaks ADR-0010 Select chrome cohesion

Consequences:

- FEATURE-BASELINE documents checklist 8–13 status
- I18N-MAP clarifies language switcher exception and `x-default` policy
- No new Feature ID; work folds into FEAT-PLATFORM-010 follow-through / Unreleased changelog

Affected docs: FEATURE-BASELINE, I18N-MAP, SCREEN-MAP, COMPONENT-MAP, recipes README, TEMPLATE-CHANGELOG

Follow-up: None

## ADR-0020 — Marketing checklist 14–19 alignment (keep intentional exceptions)

Date: 2026-07-31

Status: Accepted

Context: A marketing-site checklist (environment variables, security headers, analytics/privacy, TypeScript, formatting, testing) was compared to the starter after sections 8–13 (ADR-0019). Most baseline items already ship or are intentionally host/recipe-owned. Checklist wording that conflicts with accepted ADRs must be recorded as exceptions rather than forcing a rewrite of the static, platform-neutral starter.

Decision:

- Keep Astro `env.schema` for public client fields and build-time site origin via `resolveSiteUrl()` (ADR-0018; **amended by TADR-0002** to use `PUBLIC_SITE_URL` only — historical text below kept `SITE_URL`); do not add SMTP/Sentry/contact secrets to `.env.example` without matching baseline features
- Keep security headers, host-header CSP (report-only→enforce), and host config files out of the repository root; document via [security-cache-and-csp.md](../recipes/security-cache-and-csp.md) (ADR-0017). SSR CSRF/session/cookie controls remain N/A while `output: 'static'`
- **Astro-native `security.csp` (Astro 6+)** was evaluated and is **deferred** from baseline because of external GA, inline theme bootstrap, and fonts. Host-header CSP and Astro-native CSP are separate recipes; do not claim the baseline is CSP-compliant
- **Keep baseline Analytics** (`Analytics.astro` + CookieConsent + production GA4 via official `gtag.js`) with honest **opt-out** mode by default (ADR-0014 / FEAT-PLATFORM-007), even though checklist section 16 wording prefers not loading non-essential tracking before choice. Do not switch the baseline default to opt-in; use `PUBLIC_GOOGLE_ANALYTICS_MODE=opt-in` or [consent-aware-analytics.md](../recipes/consent-aware-analytics.md) for stricter pre-load blocking / Consent Mode v2
- Keep a single analytics platform in baseline (GA4 only); do not ship Matomo, GTM containers, Meta Pixel, LinkedIn Insight, heatmaps, or Sentry runtime
- Treat Search Console, Bing Webmaster, Sentry, uptime monitoring, and deploy/contact failure alerts as adopting-project / host operations (document in DEPLOYMENT; not starter runtime)
- Keep TypeScript `astro/tsconfigs/strictest`, `@/*` paths, and `astro check` inside `build`; add a `format` script alias alongside `format:fix` / `format:check`
- Keep Prettier (Astro + Tailwind plugins) and ESLint; add `.editorconfig` aligned with Prettier. Do not introduce Husky, lint-staged, commitlint, or Stylelint by default
- Keep Playwright Chromium as the CI browser; do not add Firefox/WebKit or visual regression to the default PR matrix. Do not add production contact-form e2e (forms remain recipe/scaffold per ADR-0017 / ADR-0019)
- Close safe gaps only: FEATURE-BASELINE map for 14–19, core-page HTTP 200 + single-`h1` + broader console guards in e2e, CI `push`/`pull_request` triggers, `.editorconfig`, `format` alias

Alternatives considered:

- Switch GA4 default to opt-in (no load before choice) to match checklist wording — rejected for baseline default; ADR-0014 keeps `opt-out` with optional `opt-in` mode
- Remove Analytics from baseline to avoid the wording conflict — rejected; FEAT-PLATFORM-007 remains an intentional product capability
- Enable Astro-native `security.csp` in baseline — deferred; conflicts with GA, inline theme bootstrap, and font asset serving without a measured policy
- Commit host security header files or sample SMTP/Sentry env vars — rejected; host-neutral / no unused secrets (ADR-0017)
- Add multi-browser CI and visual regression on every PR — deferred; Chromium smoke matches TESTING minimum; full browsers remain a pre-release strategy

Consequences:

- FEATURE-BASELINE documents checklist 14–19 status alongside 8–13
- Opt-out Analytics remains documented as an intentional exception to checklist pre-consent language
- Baseline does not claim CSP compliance; adopters configure host and/or Astro-native CSP via recipe
- No new Feature ID; work folds into Unreleased changelog / DEPLOYMENT ops notes

Affected docs: FEATURE-BASELINE, DEPLOYMENT, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, recipes/security-cache-and-csp.md, SECURITY-AND-PRIVACY

Follow-up: None for checklist alignment; Astro-native CSP remains recipe-owned until a future TADR revisits it

### Amendment — 2026-07-31

Previous: Implied host CSP only; did not record Astro-native CSP evaluation.

New: Astro-native `security.csp` evaluated and deferred; host-header vs Astro-native treated as separate recipes; analytics language aligned with honest opt-out / modes (ADR-0014).

Reason: Avoid claiming CSP readiness while GA, inline theme bootstrap, and fonts remain unconstrained in baseline.

Migration: Follow [security-cache-and-csp.md](../recipes/security-cache-and-csp.md) for host headers; treat Astro-native CSP as an optional adopting-project experiment, not a baseline guarantee.

Affected docs: FEATURE-BASELINE, DEPLOYMENT, recipes/security-cache-and-csp.md, SECURITY-AND-PRIVACY, TEMPLATE-CHANGELOG

## ADR-0021 — Marketing checklist 20–21 alignment (CI/CD and hosting)

Date: 2026-07-31

Status: Accepted

Context: A marketing-site checklist (CI/CD pipeline, package-manager pinning, preview/deploy/rollback, cache headers, host TLS/compression, migration redirects, uptime) was compared to the starter after sections 14–19 (ADR-0020). Most quality gates already run in GitHub Actions. Checklist wording that prefers pnpm, Lighthouse on every PR, or vendor host config files conflicts with accepted ADRs and the platform-neutral static baseline.

Decision:

- **Keep npm** with committed `package-lock.json` and `npm ci` (ADR-0017 / DEPLOYMENT). Do not add `packageManager: "pnpm@…"` or a second lockfile. Treat checklist pnpm / `--frozen-lockfile` wording as satisfied by `npm ci`. npm remains the only baseline package manager (supersedes any pnpm baseline guidance)
- Pin Node via `.nvmrc` (`24`, latest Node 24 patch) aligned with `engines.node` (`>=24 <25`) and CI `node-version-file: '.nvmrc'`
- Keep the CI quality path: install → format check → lint → Astro check → Vue typecheck → unit tests → build (blocks on `astro check`) → `test:budget` → `test:links` → Playwright Chromium smoke → upload `dist/` as artifact `static-dist` (retention 14 days). **Trigger: `workflow_dispatch` only** (no automatic `push` / `pull_request`); local/PR gates use `npm run ci:local`
- Use `test:budget` (gzip/JS budgets) plus `test:links` as the default PR performance/link gates; do **not** add Lighthouse CI to every PR. Adopters may run Lighthouse/Web Vitals baselines as a release or host check
- Keep deploy, PR preview hosting, deployment secrets, and uptime/deploy failure wiring **out of the starter**; document adopter/host ownership in DEPLOYMENT (ADR-0017). The CI `static-dist` artifact is a verified build upload for rollback/reuse — not a host deploy
- Keep cache headers (`/_astro/*` immutable; HTML revalidate), Brotli/Gzip, HTTP/2|3, HTTPS, canonical hostname, and trailing-slash redirects as **host/recipe** configuration — see [security-cache-and-csp.md](../recipes/security-cache-and-csp.md) and [routing-and-host-redirects.md](../recipes/routing-and-host-redirects.md). Do not commit `vercel.json` / `netlify.toml` / `_headers` in the template root
- Keep custom `404.astro` in baseline; hosts must map unknown routes to `404.html`
- Document rollback as redeploy of a previous `static-dist` CI artifact (14-day retention) and/or previous git SHA build; document that replacing an existing website requires collecting old URLs and mapping each to the closest new URL with permanent redirects (not blanket homepage redirects)

Alternatives considered:

- Switch the template to pnpm to match checklist packageManager field — rejected; overturns ADR-0017 and managed DEPLOYMENT/standards wording
- Add Lighthouse CI on every PR — deferred; budget + link scripts match template PERFORMANCE standard; full Lighthouse remains adopter/release strategy
- Commit a single-vendor preview/deploy workflow or header file — rejected; breaks host-neutral stance (ADR-0017)
- Ship a sample old-URL redirect map in the starter — rejected; no real migration target in the template
- Stay on Node 22.12 — superseded; engines and `.nvmrc` move to Node 24 LTS line

Consequences:

- FEATURE-BASELINE documents checklist 20–21 status alongside 14–19
- npm remains the intentional exception to checklist pnpm language
- CI retains a downloadable verified `dist/` for 14 days to support rollback without inventing a deploy workflow
- No new Feature ID; work folds into Unreleased changelog / DEPLOYMENT CI notes (also recorded under TADR-0001)

Affected docs: FEATURE-BASELINE, DEPLOYMENT, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, DEPLOYMENT-AND-OPERATIONS, CONTRIBUTING, DEPENDENCY-REGISTER

Follow-up: None

### Amendment — 2026-07-31

Previous: Node `.nvmrc` `22.12` / `engines >=22.12.0`; CI documented as having no `dist/` publish artifact; rollback was generic “previous static artifact”.

New: Node 24 (`>=24 <25`, `.nvmrc` `24`); after Playwright succeeds, upload `dist/` as `static-dist` (14-day retention); rollback docs reference that artifact; npm-only policy restated.

Reason: Align engines/CI with Node 24 LTS and give adopters a concrete verified build artifact for rollback without adding deploy workflows.

Migration: Use Node 24 locally (`nvm use` / matching toolchain). Download `static-dist` from a green CI run when re-promoting a known-good build.

Affected docs: FEATURE-BASELINE, DEPLOYMENT, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, DEPLOYMENT-AND-OPERATIONS, CONTRIBUTING, DEPENDENCY-REGISTER

## TADR-0001 — Decision namespace, Node 24, and CI dist artifact

Date: 2026-07-31

Status: Accepted

Context: The template accumulated several documentation mismatches after analytics modes, iconDir relocation, selective font preload, host URL contract, prefetch opt-in, Node 24, and CI artifact upload landed in code. Historical template ADRs used `ADR-####` while product ADRs share the same prefix in `docs/system/DECISIONS.md`.

Decision:

- New **template** decisions use `TADR-####` in this file; historical `ADR-0009`–`ADR-0021` keep their numbers
- Adopting-product decisions remain `ADR-####` in `docs/system/DECISIONS.md`
- Publish [DECISIONS-INDEX.md](DECISIONS-INDEX.md) linking both logs
- Confirm Node `>=24 <25`, `.nvmrc` `24`, CI `node-version-file: '.nvmrc'`, npm-only lockfile policy, and CI `static-dist` artifact (14-day retention) as the operational baseline (details amended on ADR-0021)
- Prefer amending existing ADRs for behavior already covered (0011, 0014–0016, 0018, 0020–0021) rather than duplicating full decisions

Alternatives considered:

- Renumber all template ADRs to `TADR-####` — rejected; breaks existing cross-references
- Continue dual `ADR-####` namespaces without an index — rejected; confusing for adopters
- Skip a summarizing TADR and only amend — weaker discoverability for namespace/CI/Node policy

Consequences:

- Maintainers add `TADR-0002+` for net-new starter decisions
- Docs/maps/standards/recipes/Cursor rules aligned in the same consistency pass

Affected docs: DECISIONS-INDEX, FEATURE-BASELINE, DEPLOYMENT, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, `docs/system/DECISIONS.md` purpose note, managed standards Node baseline lines

Follow-up: None

## TADR-0002 — Opt-in analytics default, build-time site URL loading, and command/CI separation

Date: 2026-08-21

Status: Accepted

Context: Six adopting release branches independently fixed build-time `.env` loading for site origin, moved analytics toward stricter consent, and suffered slow CI/Git loops from mixed validate/build/verify scripts and oversized release PRs. ADR-0014’s default **opt-out** conflicted with the privacy posture product now wants as the template baseline.

Decision:

- **Supersede ADR-0014 default mode:** `PUBLIC_GOOGLE_ANALYTICS_MODE` default and invalid-value fallback become **`opt-in`**. Modes `opt-out` and `off` remain available. Stored `denied` is still always honored.
- CookieConsent privacy settings remain available when analytics is **enabled** and mode is not `off`, even without a Measurement ID. The first-visit banner auto-opens only when a production-valid ID can load.
- Keep **`PUBLIC_SITE_URL`** as the only site-origin env var (no `SITE_URL`). Resolve via process env then Vite `loadEnv` file values in `astro.config.ts` (Astro evaluates config before normal Vite env injection). Do **not** require a parallel `SITE_URL` alias. Register `PUBLIC_SITE_URL` and **`ENV`** (`local` \| `staging` \| `production`) in Astro `env.schema` for typed `astro:env/server` access; `robots.txt` indexes only when `ENV=production` and the origin is not the example fallback.
- Sitemap uses `isIndexableSitemapPage` to exclude locale-less `/`, error pages, robots/RSS, and `.well-known`, while keeping articles and catalog.
- Theme preference storage gains a monotonic schema version (`site-theme-schema`) that migrates legacy scalar modes and never downgrades a newer stored schema.
- npm scripts separate layers: `fix:*` (mutate), `validate` (source), `build` (artifact only), `verify:*` (dist/preview). CI runs source checks once, builds once, then verifies without re-check or rebuild. Git Cursor rules use a fast batch snapshot and milestone-sized PRs.
- Portfolio/Person, cleanup, favicons, content gates, and analytics event taxonomies stay recipes — not baseline runtime.

Alternatives considered:

- Keep ADR-0014 opt-out default — rejected by explicit product decision for this template pass
- Rename away from `PUBLIC_SITE_URL` back to `SITE_URL` — rejected; product asked for `PUBLIC_SITE_URL` only
- Keep both `SITE_URL` and `PUBLIC_SITE_URL` — rejected; dual names caused adopting-project drift
- Copy client-specific content gates / event names into baseline — rejected
- Edit managed `docs/standards/**` in-repo — command taxonomy + fast Git synced 2026-08-22; other items may still defer to external package publish

Consequences:

- Adopters relying on pre-choice GA under the old default must set `PUBLIC_GOOGLE_ANALYTICS_MODE=opt-out` explicitly
- Adopters using legacy `SITE_URL` must rename to `PUBLIC_SITE_URL`
- Adopters relying on `npm run build` for typecheck must run `npm run validate` (or `check` + `typecheck:vue`) first
- `npm run test:e2e` no longer builds; run `npm run build` first or use `npm run ci:local`
- ADR-0020 checklist wording that treated opt-out as the intentional analytics exception is superseded for the **default**; opt-out remains an available explicit mode

Affected docs: FEATURE-BASELINE, DEPLOYMENT, PERFORMANCE-BUDGET, COMPONENT-MAP, API-USAGE, RENDERING-MATRIX, TEMPLATE-CHANGELOG, TEMPLATE-VERSION, README, recipes/*, DECISIONS-INDEX, governance proposal

Follow-up: Central standards package sync for command taxonomy + fast Git (see governance proposal)

### Amendment notes for related ADRs

- **ADR-0014:** default mode and invalid fallback are now `opt-in` per TADR-0002; prefer amending references rather than renumbering.
- **ADR-0020:** baseline no longer claims opt-out as the intentional default exception; checklist “no load before consent” is now the default via opt-in.
- **ADR-0021:** CI path is validate-once → build-once → verify; `build` no longer embeds Astro/Vue checks. GitHub Actions trigger is **`workflow_dispatch` only** (manual); automatic `push`/`pull_request` are intentionally disabled for this template repo.

## TADR-0003 — Tailwind-complete ordinary UI (minimize Pure/Raw CSS)

Date: 2026-08-21

Status: Accepted

Context: Adopting projects and agents occasionally reintroduced Pure/Raw CSS or component `<style>` blocks for ordinary layout, spacing, and color that Tailwind utilities already cover, creating parallel styling paths.

Decision:

- Ordinary Astro/Vue UI must be styled with **Tailwind CSS utilities** and CVA/`cn` variant maps.
- Pure/Raw CSS and component `<style>` are allowed only for: design tokens/theme, view transitions, keyframe/complex animation (with reduced-motion), rich-text/MDX descendant selectors, approved third-party selector APIs, and rare pseudo-elements with no utility equivalent.
- Do not add feature-specific global CSS files for one-off pages.
- Baseline cleanup: skip-link moved to utilities; ErrorPage keeps scoped keyframes as an allowed animation exception; `typography.css` / `view-transitions.css` remain intentional exceptions.

Alternatives considered:

- Ban all non-utility CSS including tokens/prose/VT — rejected; those cannot be expressed as utilities cleanly
- Leave styling guidance soft (“prefer Tailwind”) — rejected; too weak to stop raw CSS drift

Consequences:

- Reviews reject Pure/Raw CSS that only duplicates utilities
- Managed `STYLING.md`, Cursor `astro-styling` rule, CONTRIBUTING, FRONTEND-AI, and PR checklist document the same policy

Affected docs: STYLING, CONTRIBUTING, FRONTEND-AI, PR-REVIEW-CHECKLIST, TEMPLATE-CHANGELOG, README, DECISIONS-INDEX, `.cursor/rules/astro/astro-styling.md`

Follow-up: Sync strengthened wording into the central standards package when that package is updated
