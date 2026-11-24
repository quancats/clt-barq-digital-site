# Commit Standards

## Required format

```text
<type>(<scope>): <short summary> (#<issue number>)

<description>
```

## Description template

```text
Feature: FEAT-...
Milestone: MS-...
Domain: ...
Application: ...

What changed:
- ...

Why:
- ...

Docs updated:
- ...

Tests:
- ...
```

## Rules

- Do not commit unrelated changes together.
- Do not hide formatting-only changes inside feature commits.
- Do not commit generated files without review.
- Do not commit broken docs references.
- Use `docs` commits for documentation-only changes.
- Use `chore(standards)` for standards sync.
- Never `git add .` / `-A` / `commit -am`; stage with pathspecs only.
- One fast `git status` + `git diff --stat` snapshot per commit batch; do not re-scan the whole repo before every commit in the batch.

## Validation note in description

When applicable, list checks run: `validate`, `build`, `verify:*`, or why skipped (e.g. docs-only).
