# Cursor Command — Fix Astro Bug

Mode: **implement** (mutating). Scope the smallest safe fix only.

Bug: [DESCRIPTION]
Expected: [EXPECTED]
Actual: [ACTUAL]
Target: [FILES/ROUTES]

Find the root cause before editing. Classify rendering, hydration, content, locale, SEO, build, styling, performance, or deployment impact.

Apply the smallest safe fix, preserve unrelated behavior and all locales, avoid client-only workarounds and fake data, add regression coverage, and update docs/changelog when behavior changed.

## Command layers

- After the fix: `npm run validate` for source gates
- If routes/assets changed: `npm run build` then `npm run verify` (or targeted `verify:e2e` / `verify:links` / `verify:budget`)
- Do not embed mutating `fix:*` inside verification

## Required final output

- understanding of the requested scope
- standards and project documents consulted
- actions performed or findings produced
- validation completed or not run
- documentation affected
- blockers, risks, and required human decisions

## Safety

Do not invent missing product facts, content, endpoints, dependencies, editorial workflows, or deployment behavior. Stop at the appropriate gate when the task is not ready.
