# Cursor Command — Audit Astro Performance

Mode: **verify / experiment** (read-only by default). Do not change code unless explicitly requested. Do not run `fix:*`.

Audit the production build without changing code unless requested.

Prerequisite: a current `dist/` from `npm run build`. Then prefer `npm run verify:budget` (and optional Lighthouse/host checks outside CI).

Inspect route output, island count, hydration directives, client chunks, duplicated runtimes, LCP/CLS/INP risks, images, fonts, third-party scripts, CMS build fetching, runtime/caching, and project budgets.

Return blocking regressions, prioritized recommendations, expected impact, and a measurable validation plan.

## Required final output

- understanding of the requested scope
- standards and project documents consulted
- actions performed or findings produced
- validation completed or not run
- documentation affected
- blockers, risks, and required human decisions

## Safety

Do not invent missing product facts, content, endpoints, dependencies, editorial workflows, or deployment behavior. Stop at the appropriate gate when the task is not ready.
