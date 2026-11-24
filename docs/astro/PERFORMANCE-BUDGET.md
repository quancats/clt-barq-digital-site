# Performance Budget

## Content routes (`/ar/`, `/en/articles/`, article detail)

| Metric                     | Budget                         | Notes                                                                                          |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| Hydrated roots per route   | 1                              | `HeaderChrome` only (ADR-0010); BaseLayout theme bootstrap / CookieConsent are not Vue islands |
| Client JS (template-owned) | ≤ 120 KB gzipped header chrome | Vue + Reka NavigationMenu/Select shared with UI primitives                                     |
| Critical font files        | ≤ 1 family per page            | Selective preload weight 400 + locale subset; Tajawal on `ar`, Manrope on `en` (ADR-0015)      |
| LCP image                  | N/A initially                  | No hero image asset required in fixture; default OG image is `/images/og/default.png`          |
| Third-party scripts        | 0 until configured             | GA4 `gtag.js` per analytics mode when ID set/enabled; stored `denied` always blocks (ADR-0014) |
| Core Web Vitals target     | Good on mobile for static HTML | Measure on adopting brand content                                                              |

## Error routes (`/404`, `/500`)

| Metric                   | Budget | Notes                                                                                             |
| ------------------------ | ------ | ------------------------------------------------------------------------------------------------- |
| Hydrated roots per route | 0      | Full-bleed `ErrorPage` on `BaseLayout` only (theme bootstrap / CookieConsent are not Vue islands) |
| Client JS                | ~0     | Decorative SVG + CSS motion; retry uses inline `location.reload()` on 500/408                     |

## Component catalog routes (`/ar/components`, `/en/components`)

| Metric                   | Budget                                             | Notes                                                               |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------------------------- |
| Hydrated roots per route | 2                                                  | `HeaderChrome` (`client:load`) + `ComponentCatalog` (`client:idle`) |
| Catalog client JS        | ≤ 220 KB gzipped (measured ~159 KB)                | Vue + Reka UI + Embla + vee-validate/Zod + Sonner for demos only    |
| SSR HTML                 | Required                                           | Islands must render meaningful markup before hydration              |
| Scope guard              | Do not import catalog island outside `/components` | Header chrome is the only other approved island                     |

Measure after `npm run build` with `npm run verify:budget` (sums island-owned chunks plus shared Vue/Reka runtime; island list is data-driven in `scripts/check-performance-budget.mjs`). If a budget is exceeded, split demos or defer heavier widgets before expanding the budget. CI also runs `npm run verify:links` against `dist/` HTML.

Notes on icons (FEAT-PLATFORM-005 / ADR-0011):

- `astro-icon` inlines SVG at build time on Astro surfaces; it does not add hydrated roots or client icon JS to content or catalog budgets
- `@lucide/vue` remains inside the existing header/catalog Vue chunks only
- Do not introduce Iconify CDN/runtime clients or icon fonts

Notes on view transitions (FEAT-PLATFORM-006 / ADR-0012):

- Browser-native cross-document View Transitions are CSS-only (`src/styles/view-transitions.css`)
- No Astro `ClientRouter`, no router chunk, and no change to hydrated-root counts
- Unsupported browsers keep ordinary full-page navigation with no fallback JS budget impact

Notes on fonts (ADR-0015):

- Tajawal (`--font-tajawal`) and Manrope (`--font-manrope`) are registered via Google provider in `astro.config.ts`
- `BaseHead` selectively preloads weight `400` + locale subset for the active family only; `html[lang]` maps `--font-document`
- Fonts are locally served build assets; do not assume a fixed `/_astro/fonts` public path
- Do not reintroduce Google Fonts / CDN `@import` stylesheets; add families through the Astro Fonts API only
- Keep registered subsets/weights to what production UI uses (`400`/`500`/`700`); preload remains body weight only

Notes on analytics (FEAT-PLATFORM-007 / ADR-0014 / TADR-0002):

- With `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false` or `PUBLIC_GOOGLE_ANALYTICS_MODE=off`, builds inject zero third-party analytics scripts and omit preference UI
- Without a Measurement ID, preference UI may still be available when analytics is enabled; the first-visit banner does not auto-open and no `gtag.js` is injected
- Default `opt-in` waits for `granted`; `opt-out` may load before first choice; stored `denied` always blocks further loads
- CookieConsent + footer privacy settings when analytics is enabled and mode is not `off`
- No analytics npm package, no Partytown, and no new hydrated roots (preference UI uses a tiny inline script)
- Consent Mode v2 defaults remain optional via `docs/recipes/consent-aware-analytics.md`

Notes on theme storage (TADR-0002):

- Preference mode remains `light` / `dark` / `auto` under `site-theme`
- Monotonic schema version under `site-theme-schema` migrates legacy scalar values and never downgrades a newer stored schema

Notes on prefetch (ADR-0018):

- Config is `{ prefetchAll: false, defaultStrategy: 'viewport' }`; only links with `data-astro-prefetch` (primary nav + high-confidence CTAs) prefetch

Review triggers:

- Adding any `client:*` directive outside approved islands
- Adding third-party scripts beyond optional GA4
- Introducing an adapter or large client library
- Expanding theme scripts beyond FOUC prevention and preference switching
- Growing the catalog island beyond the approved component set
- Expanding header chrome beyond NavigationMenu + mobile Sheet + language/theme icon Selects + CTA without a new Feature ID / ADR
- Adding an icon font, Iconify client/CDN runtime, or an extra Iconify collection without an approved exception
- Introducing Astro `ClientRouter` / SPA client routing without a new Feature ID / ADR
- Enabling analytics without documenting consent/privacy ownership for the adopting project

The CSS budget uses the measured `v1.1.1` baseline for each locale home and catalog route. It caps the number of linked Astro stylesheets at the baseline and allows 10% headroom in the summed gzip sizes of linked and inline CSS. The report includes inline style count separately. Both CSS and JS checks run through `npm run verify:budget`.
