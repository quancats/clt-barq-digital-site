# Cursor Command — Review Astro Change or PR

Mode: **review** (read-only). Do not rewrite application code, run mutating fix scripts, or “helpfully” implement fixes unless explicitly requested.

Target: [DIFF/FILES/BRANCH]

Review architecture before style. Check SOP traceability, Astro suitability, rendering/hydration, placement, content/CMS/API, security/privacy, i18n/SEO/accessibility, performance, TypeScript/tests/build, and documentation drift.

Prefer evidence from existing diffs and optional non-mutating verify/validate commands. Do not run `fix:*` or rewrite files during review.

Return verdict, Critical issues, Important improvements, Optional refinements, validation status, and final recommendation.

## Required final output

- understanding of the requested scope
- standards and project documents consulted
- actions performed or findings produced
- validation completed or not run
- documentation affected
- blockers, risks, and required human decisions

## Safety

Do not invent missing product facts, content, endpoints, dependencies, editorial workflows, or deployment behavior. Stop at the appropriate gate when the task is not ready.
