# Standards Evolution Proposal — Command taxonomy and fast Git workflow

Date: 2026-08-21

Status: Accepted (synced to `docs/standards/` in astro-template; publish to external standards package when that package next releases)

Owner: Astro template maintainers

Pilot: `astro-template` (this repository)

## Problem observed

Adopting projects and agents mixed mutating, validation, build, and verification work:

- `build` re-ran Astro/Vue checks already executed in CI
- `test:e2e` rebuilt again after CI already had `dist/`
- `format` / `format:fix` were duplicates
- Git rules required a heavy “full repository analysis” before every commit, slowing batch work
- Oversized release PRs (150–1000+ files) skipped automated review and harmed review quality

## Proposed rule / pattern

### 1. npm command layers

| Layer                              | Purpose                             | Mutates tree?             | Examples                                                 |
| ---------------------------------- | ----------------------------------- | ------------------------- | -------------------------------------------------------- |
| `fix:*`                            | Auto-fix formatting/lint            | Yes                       | `fix:format`, `fix:lint`                                 |
| `validate`                         | Source gates                        | No                        | `format:check`, `lint`, `check`, `typecheck:vue`, `test` |
| `build`                            | Produce `dist/` only                | Build output only         | `astro build`                                            |
| `verify:*`                         | Assert on `dist/` / running preview | No source rewrite         | `verify:budget`, `verify:links`, `verify:e2e`            |
| `dev` / `preview` / `experiment:*` | Local exploration                   | Experiment artifacts only | `dev`, `preview`, recipe `experiment:favicons`           |

Rules:

- CI must not run `fix:*`
- `build` must not embed `astro check` / `vue-tsc` when CI already ran them
- `verify:e2e` assumes a prior production build (Playwright preview uses `dist/`)
- Provide `ci:local` = `validate && build && verify` for one-shot local parity

### 2. Fast Git workflow (Cursor / agent)

- One lightweight snapshot per commit batch: `git status --short`, `git diff --stat`, `git diff --cached --stat`
- Selective pathspec staging only; forbid `git add .` / `-A` / `commit -am`
- Do not re-analyze whole repo structure before every commit in the same batch
- Risk-proportionate checks (docs-only ≠ full verify)
- When the user already asked to commit/proceed, execute a split plan without an extra approval wait
- Prefer milestone-sized PRs; avoid mega release PRs that exceed practical review limits (~150 files)

## Official reference / production evidence

- Six adopting release branches independently kept the old mixed script graph and identical slow Git rule copies
- CI duplication: standalone `check` + `typecheck:vue` then `build` that repeated both
- CodeRabbit skipped reviews on oversized release PRs (evidence from Quancats/Quanizon/Kinan/Firas release branches)

## Files affected (central package, when accepted)

- `docs/standards/astro/TESTING.md` (script examples)
- `docs/standards/astro/DEPLOYMENT-AND-OPERATIONS.md` (CI sequence)
- `docs/standards/git/GIT-WORKFLOW.md`
- `docs/standards/git/COMMIT-STANDARDS.md`
- `docs/standards/git/PR-GUIDE.md`
- Synced Cursor mirrors under `.cursor/rules/` when the package publishes

## SOP impact

- Non-breaking for product features
- Workflow/CI contract change for template and adopting projects that sync standards
- Does not change locale URL strategy, content ownership, or rendering defaults

## Compatibility impact

- Adopters relying on `npm run build` to typecheck must run `npm run validate` (or `check` + `typecheck:vue`) explicitly
- `npm run test:e2e` no longer builds; run `npm run build` first or use `npm run ci:local`
- Transitional aliases: `format` / `format:fix` → `fix:format`; `test:budget` / `test:links` / `test:e2e` → `verify:*`

## Migration path

1. Land taxonomy in `astro-template` (pilot — done)
2. Sync into `docs/standards/` in this repository (done 2026-08-22)
3. Publish a standards minor/patch in the **external** central package with migration notes
4. Sync into other adopting projects via the normal standards sync process

## Rollback path

- Restore previous `package.json` script graph and CI job order
- Restore previous Git Cursor rule wording
- Keep aliases during one standards release if needed

## Classification

Non-breaking for runtime/site behavior. Workflow-breaking for CI/script habits — document under standards changelog; do not auto-force into active projects without sync notes.
