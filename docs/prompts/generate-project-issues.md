# Cursor Prompt — Generate Project Issues

```text
You are acting as a senior technical project planner.

Do not write application code.

Generate a complete issue breakdown for this project based on system documentation.

Read:
- docs/system/PROJECT-BRIEF.md
- docs/system/PRODUCT-SCOPE.md
- docs/system/SYSTEM-ARCHITECTURE.md
- docs/system/APPLICATION-MAP.md
- docs/system/DOMAIN-MAP.md
- docs/system/DATA-OWNERSHIP.md
- docs/system/FEATURE-REGISTRY.md
- docs/system/API-CONTRACTS.md
- docs/system/FLOW-MAP.md
- docs/system/IMPLEMENTATION-PLAN.md
- docs/system/PERMISSION-MATRIX.md

Create/update:
- docs/issues/PROJECT-ISSUES.md

For each issue, include:
- Title
- Repository
- Application owner
- Feature ID
- Milestone
- Domain
- Type
- Priority
- Dependencies
- Scope
- Out of scope
- Acceptance criteria
- Required docs updates
- Required tests/checks
- Risks

Rules:
- Issue titles are the clear issue name only — no `[MS-…]`, `[FEAT-…]`, `[type]`, or surface prefixes.
- Put milestone, type, and priority on GitHub Milestone / Labels / Issue Types; keep Feature ID, milestone, type, and repository in the issue body fields.
- Split work by repository.
- Do not create vague issues.
- Do not combine backend and frontend implementation into one issue unless they are documentation/planning tasks.
- Add dependency order.
- Mark blockers clearly.
- Include documentation and review issues.

Output:
1. Summary of issue counts by milestone/repo/type
2. Full issue list in Markdown
3. Suggested implementation order
```
