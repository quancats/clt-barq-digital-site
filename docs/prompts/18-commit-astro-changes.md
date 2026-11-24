# Cursor Prompt — Commit Current Astro Changes

Analyze Git changes and split them into logical commits by Feature ID, milestone, and responsibility.

Before committing:

- identify unrelated changes
- ensure generated/build output and secrets are excluded
- confirm docs/tests accompany behavior changes
- propose commit order if broad

Format:

```text
<type>(<scope>): <summary> (#<issue>)

- What changed
- Why
- Docs updated
- Tests/validation
- Feature ID / Milestone
```

Do not commit if changes are unsafe, unreviewed, or combine unrelated work.
