# Onboarding

## Purpose

Help a new developer understand the project quickly.

## Project overview

`astro-template` is a static bilingual Astro content website template. There is no backend or CMS in the baseline.

## Repository map

- `src/` — Astro application code
- `tests/` — unit and e2e tests
- `docs/astro/` — template frontend maps, feature baseline, and starter ADRs (update these when maintaining the template)
- `docs/TEMPLATE-CHANGELOG.md` / `docs/TEMPLATE-VERSION.md` — template SemVer history
- `docs/system/` — adopting-project governance (do not use for template-maintainer updates)
- Root `CHANGELOG.md` / `VERSION.md` — adopting-project product SemVer (not template history)
- `docs/standards/` — managed standards (do not edit locally)

## Local setup

```bash
npm ci
npm run dev
```

## Required environment variables

- `SITE_URL` for production canonical/sitemap/RSS values
- See `.env.example`

## How to read the docs

1. For the **template starter**: `README.md`, `docs/astro/*` (especially `FEATURE-BASELINE.md`, `ROUTE-MAP.md`, `COMPONENT-MAP.md`), and `docs/TEMPLATE-CHANGELOG.md`
2. For an **adopting project**: `docs/system/PROJECT-BRIEF.md`, `PRODUCT-SCOPE.md`, `FEATURE-REGISTRY.md`, `IMPLEMENTATION-PLAN.md`
3. Managed standards under `docs/standards/astro/` for how-to rules

## How to run backend

Not applicable in baseline.

## How to run frontend

```bash
npm run dev
npm run build
npm run preview
```

## How to run tests

```bash
npm test
npm run test:e2e
```

## How to use Cursor safely

- Read governance docs before implementing
- Do not invent APIs or CMS contracts
- Do not install Vue/adapter/CMS packages without approval
- Do not edit managed standards locally

## Common workflows

- Add UI chrome strings in `src/i18n/dictionaries/{ar,en}`
- Add articles in `src/content/articles/{ar,en}`
- Keep Feature IDs and maps updated with meaningful changes

## Known risks

- Duplicate docs trees (TD-001)
- Fixture content must be replaced before launch

## Who owns what

- Application `site` owns this repository
- See `APPLICATION-MAP.md` and `DATA-OWNERSHIP.md`
