# Cursor Command — Implement a Complete Astro Feature

Mode: **implement** (mutating). Do not run this for analysis-only or verification-only requests.

Required: Feature ID, milestone, routes, content/API contract, locales, SEO, rendering decision, design reference, acceptance criteria.

Implement only the approved milestone and every documented part: content integration, components, states, responsive/RTL, accessibility, metadata, performance, tests, and documentation.

Use Astro first, named data services, minimal hydration, and approved dependencies only. Do not use fake runtime data to hide missing integrations. Do not rewrite unrelated files.

## Command layers (do not mix)

- Mutating fix: `npm run fix:format`, `npm run fix:lint` (never in CI)
- Source validate: `npm run validate` (or individual `format:check` / `lint` / `check` / `typecheck:vue` / `test`)
- Artifact build: `npm run build` (no embedded typecheck)
- Output verify: `npm run verify` after a successful build (`verify:budget`, `verify:links`, `verify:e2e`)

Finish with files changed, traceability, hydration reason, which command layer was run, docs, risks, and follow-ups.

## Required final output

- understanding of the requested scope
- standards and project documents consulted
- actions performed or findings produced
- validation / verification completed or not run (name the scripts)
- documentation affected
- blockers, risks, and required human decisions

## Safety

Do not invent missing product facts, content, endpoints, dependencies, editorial workflows, or deployment behavior. Stop at the appropriate gate when the task is not ready.
