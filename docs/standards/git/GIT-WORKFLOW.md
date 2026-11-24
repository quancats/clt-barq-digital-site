# Git Workflow

## Purpose

This file defines how branches, commits, pull requests, and releases are managed across SOP-governed projects.

## Core rules

- One branch per focused task.
- One PR per coherent change set (milestone-sized; avoid mega release dumps — see PR-GUIDE).
- Do not mix unrelated refactors with features.
- Do not commit generated chaos in one large commit.
- Commits should map to issue, feature, milestone, and domain.

## Fast agent/human commit batches

Before a commit batch, take **one** lightweight snapshot:

```bash
git status --short
git diff --stat
git diff --cached --stat
```

From that snapshot, group changes by Feature ID / milestone / domain. Do **not** re-analyze the whole repository before every individual commit in the same batch.

Staging:

- Never `git add .`, `git add -A`, or `git commit -am`
- Use pathspecs: `git add path/to/file`, `git add -- path/one path/two`, `git add -p`
- Review staged diff only before each commit

Risk-proportionate checks:

- Docs/rules only: no full `verify:*` unless links or scripts changed
- Source logic: `npm run validate` (or smallest subset)
- Routes/build output: `npm run build` then targeted `verify:*`
- Do not run `fix:*` as verification

## Branch naming

Preferred format:

```text
<type>/<issue-number>-<short-description>
```

Examples:

```text
feat/123-auth-login-api
fix/124-login-validation-error
chore/125-sync-standards-v2
refactor/126-extract-billing-actions
```

## Commit format

```text
<type>(<scope>): <short summary> (#<issue number>)

<description>
```

Description should include:

- what changed
- why it changed
- related Feature ID
- docs updated
- tests added

## Commit types

- feat
- fix
- refactor
- docs
- test
- chore
- build
- ci
- perf
- revert

## Split commits by

- Feature ID
- domain
- milestone
- repository/application
- docs vs code when large

## PR expectations

Every PR should include:

- issue link
- Feature ID
- milestone
- scope summary
- test summary
- docs updated
- risks
- screenshots for UI/admin/frontend where relevant
