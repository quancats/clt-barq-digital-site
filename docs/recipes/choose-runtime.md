# Recipe: Choosing runtime (static vs adapter / Actions / ClientRouter)

## Baseline

- `output: 'static'`
- No Astro adapter
- No Astro Actions / API mutations
- No `<ClientRouter />` (ADR-0012 — CSS view transitions only)

## Decision matrix

| Need                                         | Prefer                                      | Avoid in marketing sites          |
| -------------------------------------------- | ------------------------------------------- | --------------------------------- |
| Contact form posting to company API          | Static HTML form / serverless endpoint      | Full SSR for the whole site       |
| Auth, sessions, personalized HTML            | Official adapter matching the host          | Fake personalization in static JS |
| CMS webhook rebuild                          | CI rebuild of static site                   | Runtime CMS SDK without contract  |
| Persistent client islands across navigations | Document requirement + ADR for ClientRouter | ClientRouter “for animations”     |

## If you adopt an adapter

1. Open Feature ID + ADR in the adopting project
2. Update `docs/astro/RENDERING-MATRIX.md` / `DEPLOYMENT.md` equivalents for that product
3. Add the official adapter only (`@astrojs/node`, `@astrojs/cloudflare`, `@astrojs/vercel`, `@astrojs/netlify`, …)
4. Extend CI for server preview/smoke tests
5. Revisit CSRF, origin validation, cookies, and rate limits

## Acceptance checks

- Still answer the architectural questions in the marketing baseline before adding runtime
- Client JS / hydration budgets remain measured
- No ClientRouter without superseding ADR-0012

## Out of scope for the shared template

- Installing any adapter by default
- Hybrid SSR “just in case”
