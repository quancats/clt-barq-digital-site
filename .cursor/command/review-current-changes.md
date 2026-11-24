# Cursor Command — Review Current Changes

Mode: **review** (read-only). Do not rewrite code unless explicitly asked. Do not run `fix:*`.

```text
Review current changes against SOP and relevant backend/frontend/git standards.

Do not rewrite code unless explicitly asked.

Return actionable findings grouped by severity:
- Critical
- High
- Medium
- Low

For each finding:
- file
- problem
- why it matters
- exact fix recommendation
```

## When to use

Use this command inside Cursor after the repository has the relevant standards and docs available inside the workspace. For multi-repository systems, make sure `docs/system` exists locally or that the workspace root contains the documentation repository.

## Expected behavior

Cursor should be strict. It should not fill gaps by inventing business behavior, database ownership, API contracts, routes, permissions, or milestones. Missing context should result in a readiness/documentation report, not generated code.
