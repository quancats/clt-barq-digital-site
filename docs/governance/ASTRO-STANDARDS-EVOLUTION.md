# Astro Standards Evolution

## Purpose

Evolve the Astro standards without bypassing or weakening the Project Start SOP.

## Change process

```text
Enhancement proposal
→ impact review
→ classify breaking/non-breaking
→ pilot project
→ documentation migration notes
→ version release
→ profile-based rollout
```

## Required proposal fields

- problem observed
- proposed rule or pattern
- official reference or production evidence
- files affected
- SOP impact
- compatibility impact
- migration path
- rollback path
- pilot project and owner

## Breaking changes

Examples:

- changing project directory structure
- changing locale URL strategy
- changing approved content ownership model
- replacing Vue islands with another client framework
- changing rendering default
- changing naming prefixes

Breaking standards require a major version and must not be automatically synced into active projects.

## Project overrides

Prefer updating managed Astro standards in `docs/standards/astro/` when a rule is the organization or starter baseline. Do not restate the baseline in `ASTRO-OVERRIDES.md`. Active projects may retain true exceptions only in `docs/standards-overrides/PROJECT-OVERRIDES.md` (owner, reason, Feature ID, review date).

## 2026-08 standards sync (workflow)

Synced to `docs/standards/` from [PROPOSAL-COMMAND-TAXONOMY-AND-FAST-GIT.md](PROPOSAL-COMMAND-TAXONOMY-AND-FAST-GIT.md):

- npm command layers: `fix:*` / `validate` / `build` / `verify:*` / `ci:local` (`TESTING.md`, `DEPLOYMENT-AND-OPERATIONS.md`, `CONTRIBUTING.md`)
- Fast Git workflow: batch snapshot, pathspec staging, milestone-sized PRs (`GIT-WORKFLOW.md`, `COMMIT-STANDARDS.md`, `PR-GUIDE.md`)

Template pilots still pending external package publish or separate sync:

- Analytics default `opt-in` and `PUBLIC_SITE_URL`-only origin resolution (TADR-0002)
- Tailwind-complete ordinary UI / minimize Pure/Raw CSS (TADR-0003)

## 2026-07 template sync (non-breaking)

Managed Astro standards include the starter baseline directly:

- GA4 production default-on when configured, with explicit disable path (ADR-0014; default mode later moved to opt-in in TADR-0002 — sync pending)
- Locale-paired Astro Fonts: Tajawal (`ar`) + Manrope (`en`) via Google provider (ADR-0015)
- npm remains the starter package manager; platform-neutral recipes live under `docs/recipes/` (ADR-0017)
- Trailing-slash prefixed locales remain the bilingual URL baseline (ADR-0016)

Classify future lockfile or URL-strategy changes as breaking and require a major standards version before syncing into active projects.
