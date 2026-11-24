# Rendering Matrix

Baseline Astro config: `output: 'static'` and `trailingSlash: 'always'` (ADR-0016). No adapter.

| Route family      | Mode                                      | Adapter | Cache                   | Hydration                                    | Approval                                            |
| ----------------- | ----------------------------------------- | ------- | ----------------------- | -------------------------------------------- | --------------------------------------------------- |
| Home / articles   | static prerender                          | none    | CDN/static host default | one `client:load` header chrome island*      | ADR-0001, ADR-0006, ADR-0010, ADR-0012, ADR-0016    |
| 404 / 500         | static prerender                          | none    | CDN/static host default | none (BaseLayout theme script only)          | ADR-0001, ADR-0012, ADR-0016                        |
| Component catalog | static prerender + SSR of Vue island HTML | none    | CDN/static host default | header `client:load` + catalog `client:idle` | ADR-0008, ADR-0010, ADR-0012, FEAT-PLATFORM-002/004 |
| RSS / sitemap     | static generated assets                   | none    | CDN/static host default | none                                         | ADR-0003                                            |

No on-demand routes, server islands, Actions, or Astro `ClientRouter` SPA mode in baseline. Do not switch to `output: 'server'` without an approved adapter ADR.

\* `BaseLayout` also includes a small approved progressive-enhancement script for pre-paint theme resolution. Theme preference changes are handled by the header chrome icon Select. Optional `Analytics` may inject third-party `gtag.js` in production builds according to `PUBLIC_GOOGLE_ANALYTICS_MODE` when configured (`FEAT-PLATFORM-007` / TADR-0002 default `opt-in`); CookieConsent is a tiny inline script. Neither is a Vue island. HeaderChrome remains the approved header island (ADR-0010); do not replace it with Astro-only chrome in baseline.

Navigation remains full document (MPA). HTML pages opt into browser-native cross-document View Transitions via CSS `@view-transition { navigation: auto; }` (`FEAT-PLATFORM-006` / ADR-0012) with zero client router JS. Unsupported browsers keep ordinary full-page navigation. GA4 page views rely on full document loads when analytics is enabled.
