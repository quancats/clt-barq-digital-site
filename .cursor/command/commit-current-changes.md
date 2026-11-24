# Cursor Command — Commit Current Changes

Mode: **git** (mutating repository history only when the user asked to commit).

```text
Analyze the current git changes and create a clean commit.

Speed rules:
1. One fast snapshot for the batch: `git status --short`, `git diff --stat`, `git diff --cached --stat`.
2. Do not re-scan the whole repository structure before every commit in the same batch.
3. Stage with pathspecs only — never `git add .` / `-A` / `commit -am`.
4. Verify staged diff only, then commit.
5. If changes span multiple features/milestones, propose a short split plan. When the user already asked to commit/proceed, execute the split without an extra approval wait.
6. Run risk-proportionate checks only (docs-only ≠ full verify).

Commit format:
<type>(<scope>): <short summary> (#<issue number>)

Description must include:
- Feature: FEAT-...
- Milestone: MS-...
- Domain: ...
- Application: ...
- What changed
- Why
- Docs updated
- Tests / validate / verify

If no issue number is known, ask for it or use a clearly marked placeholder only if explicitly allowed.
```
