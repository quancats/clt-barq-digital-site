# Cursor Command — Update Docs After Implementation

```text
Analyze latest changes and update documentation only.

Do not change application code.

Update relevant system/app docs.
Link all updates to Feature IDs, domains, applications, APIs, data objects, flows, and milestones.
If code and docs conflict, document the conflict as Documentation Gap.
Return docs update report.
```

## When to use

Use this command inside Cursor after the repository has the relevant standards and docs available inside the workspace. For multi-repository systems, make sure `docs/system` exists locally or that the workspace root contains the documentation repository.

## Expected behavior

Cursor should be strict. It should not fill gaps by inventing business behavior, database ownership, API contracts, routes, permissions, or milestones. Missing context should result in a readiness/documentation report, not generated code.
