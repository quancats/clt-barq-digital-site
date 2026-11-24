# System Architecture

## System overview

`astro-template` is a single-repository Astro static site template. It generates bilingual public HTML from local Content Collections and typed dictionaries. There is no backend, database, or CMS in the baseline.

## Architectural style

- Astro site (static / prerendered HTML)
- Local Content Collections for structured content
- No API + frontend split in baseline
- Extensible later to Astro site + CMS after contracts exist

## Applications

Reference `APPLICATION-MAP.md`.

Primary application in this repository: `site` (`astro-template`).

## Data ownership

Reference `DATA-OWNERSHIP.md`.

Baseline content is repository-owned Markdown and trusted MDX under `src/content/`.

## Integration boundaries

- No runtime API integrations in baseline
- Official Astro integrations allowed in baseline: sitemap and MDX; RSS feed via `@astrojs/rss`
- Tailwind via `@tailwindcss/vite`
- Future CMS/API work requires `API-CONTRACTS.md` updates first

## Deployment boundaries

- Static build output in `dist/`
- Any static host (Netlify, Cloudflare Pages, S3/CDN, etc.)
- Production requires `SITE_URL` for absolute canonicals, sitemap, and RSS

## Security boundaries

- Public read-only site
- No admin area
- No authenticated APIs
- Secrets must not be introduced without server-only boundaries and an approved adapter
- Staging/preview adopters must keep environments non-indexable

## Localization strategy

- Supported locales: `ar`, `en`
- Default locale: `ar`
- URL strategy: prefix every locale (`/ar/...`, `/en/...`)
- Directions: `ar=rtl`, `en=ltr`
- Hardcoded UI strings are prohibited in shared components; use dictionaries
- Long-form content lives in Content Collections, not UI dictionaries

## Theme strategy

- Modes: `light`, `dark`, `auto`
- Default: `auto` via `PUBLIC_DEFAULT_THEME` in Astro `env.schema`
- Resolved theme is applied with the `dark` class on `<html>` before first paint
- Tailwind `dark:` utilities use class strategy (`@custom-variant dark`)
- Visitor preference is stored in `localStorage` (`site-theme`)
- Theme switching uses a small Astro progressive-enhancement script; no Vue runtime

## AI implementation rules

AI must:

- read system docs first
- follow application ownership
- not invent APIs
- not create tables without data ownership
- not implement unrelated scope
- mark unclear areas as open questions
- not install Vue/CMS/adapter without approval
- not edit managed standards under `docs/standards/`

## Architecture risks

| Risk                   | Mitigation                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| Premature hydration    | Keep Vue out of baseline; require island checklist                    |
| SEO regressions        | Central SEO helpers + e2e metadata checks                             |
| Content contract drift | Zod schemas in `content.config.ts` fail the build                     |
| Docs path duplication  | Tracked in `TECHNICAL-DEBT.md`; do not edit managed standards locally |
