# Cursor Command — Commit Current Astro Changes

Mode: **git** (mutating repository history only when the user asked to commit).

Inspect the Git diff with a **fast batch snapshot** (`status --short`, `diff --stat`, cached stat). Identify issue references, Feature IDs, milestone, tests, and documentation.

Identify unrelated or unsafe changes and propose a logical commit order. Exclude secrets, generated output, build artifacts, and unreviewed package changes.

Use pathspec staging only. If the user already asked to commit/proceed, execute the split plan without an extra approval wait.

Use:

```text
<type>(<scope>): <summary> (#<issue>)

- What changed
- Why
- Docs updated
- Tests/validation/verification
- Feature ID / Milestone
```

Do not combine unrelated pages, refactors, dependencies, and content changes.
