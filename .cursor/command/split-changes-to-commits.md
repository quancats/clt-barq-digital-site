# Cursor Command — Split Changes to Logical Commits

Mode: **git** (plan by default; commit only when explicitly instructed).

```text
Analyze current git changes and split them into logical commits.

Speed rules:
- One fast snapshot: `git status --short`, `git diff --stat`, `git diff --cached --stat`.
- Group by Feature ID, domain, milestone, and application.
- Separate docs-only changes when large.
- Separate formatting-only changes when large.
- Separate refactor from behavior changes where possible.
- Prefer pathspec staging lists over interactive patch when the groups are already clear.
- When the user already said to proceed/commit, execute the approved-style plan without waiting for another confirmation round.

For each proposed commit, provide:
1. files included (pathspecs)
2. commit title
3. commit description
4. reason for grouping
5. risk

Do not commit until the plan is reviewed unless explicitly instructed to proceed.
```
