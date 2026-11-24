# Astro Performance and Budget Standard

## Architecture budgets

Every project records budgets for:

- client JavaScript per route
- number of hydrated roots
- critical CSS/font requests
- LCP image size
- total transferred bytes for representative routes
- third-party script cost
- target Core Web Vitals

Budgets are project-specific and approved before page completion.

## Default behavior

- zero JS for static sections
- no above-the-fold hydration unless essential
- defer below-the-fold islands
- optimize images through Astro
- self-host and subset fonts (Astro Fonts preferred)
- for bilingual sites: **one critical font family per page/locale** — selectively preload weight 400 + locale subset for Tajawal (`--font-tajawal`) on `ar` and Manrope (`--font-manrope`) on `en`; do not preload both families or all weights on every page
- treat fonts as locally served build assets (do not hard-require `/_astro/fonts`)
- reserve layout dimensions
- third parties: production-only; inject GA4 when configured, enabled, and analytics mode allows; honor stored `denied` via baseline CookieConsent (`PUBLIC_GOOGLE_ANALYTICS_MODE`)
- prefetch: when using Astro prefetch config with `prefetchAll: false`, opt in high-confidence links with `data-astro-prefetch` only

## Review triggers

Review is required when:

- a new client framework/runtime is added
- `client:load` is introduced
- a substantial carousel/map/search island is added
- a third-party script is added or analytics enablement changes
- an additional font family/weight is preloaded
- server rendering replaces static output
- performance budgets regress

## Evidence

Use production builds, bundle inspection, browser traces, Lighthouse/Web Vitals baselines, and representative mobile/network conditions. Template repositories may also enforce automated gzip budgets and internal-link checks in CI.
