# Cursor Rule — Astro Rendering

## Default

Static output is the default for informational and CMS-driven routes. A CMS does not imply SSR.

Rendering a Vue component and hydrating it are different decisions. A Vue component can produce Server-rendered HTML without a Client Directive. Add `client:*` only when browser interaction is required.

## Decision order

1. static HTML / Astro Component
2. static HTML plus focused script
3. static HTML plus deferred Vue Island
4. rebuild on CMS publication
5. isolated server island
6. approved on-demand route
7. full server output only after architecture review

## Client Directive priority

1. no directive
2. `client:visible`
3. `client:idle`
4. `client:media`
5. `client:load`
6. `client:only="vue"` only as a documented Browser API exception

Group related interactive controls into one Island boundary. Do not create several hydrated roots that share state. Do not hydrate an entire page or static section because one nested control is interactive.

## Approval requirements

Do not add an adapter, Action, endpoint, middleware, server island, or on-demand route without a documented freshness, privacy, cache, failure, deployment, and ownership decision. Justify `client:load` and `client:only` in review.

## Caching

Never place personalized or sensitive output in shared public caches. Document invalidation and fallback behavior.

## Framework warning

If most routes require request-time user data, authorization, or immediate Hydration, recommend Nuxt suitability review.
