# Pull Request Guide

## PR template

```md
## Summary

## Related issue

## Feature IDs

## Milestone

## Application / Repository

## Domain

## What changed

## Docs updated

## Tests / validation

## Screenshots / recordings if UI

## Risks

## Follow-up tasks
```

## Tests / validation

Prefer layered scripts (see `TESTING.md` §17):

- `npm run validate` — source gates
- `npm run build` — production artifact
- `npm run verify` — budget, links, e2e (requires prior build)
- `npm run ci:local` — full local parity

List what you actually ran. Docs-only PRs may skip `verify:*` unless routes/links/build output changed.

## PR size

- Prefer milestone-sized PRs tied to one Feature ID or a small related set.
- Avoid release dumps that exceed practical review limits (~150 changed files); split by milestone/domain.
- Mega PRs harm automated review quality and human auditability.

## Review readiness

A PR is ready only when:

- scope is focused
- docs are updated
- tests are added or justified
- no unrelated changes are mixed
- generated code is understood
- acceptance criteria are met
- reviewers can trace the work to Feature ID and milestone
