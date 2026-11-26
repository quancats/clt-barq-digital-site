# Application Map

## Purpose

This document defines all repositories/applications that make up the system and what each one owns.

## Applications

| Application | Repository            | Type                               | Purpose                                    | Deployment                                | Owner           |
| ----------- | --------------------- | ---------------------------------- | ------------------------------------------ | ----------------------------------------- | --------------- |
| site        | clt-barq-digital-site | Astro informational / content site | Public bilingual static website            | Static host / CDN                         | Frontend        |
| lead-worker | clt-barq-digital-site | Cloudflare Worker                  | Validated lead intake and delivery handoff | Worker API route, local profile available | Lead operations |

Applications below are not part of this repository baseline and must not be invented here:

| Application | Repository   | Type             | Purpose                                 | Deployment   | Owner        |
| ----------- | ------------ | ---------------- | --------------------------------------- | ------------ | ------------ |
| core-api    | Needs Review | Laravel API      | Future backend if a product requires it | Needs Review | Needs Review |
| admin-panel | Needs Review | Laravel Filament | Future CMS admin if adopted             | Needs Review | Needs Review |

## Ownership rules

### site (`clt-barq-digital-site`)

Owns:

- Astro routes, layouts, and components
- Local Content Collections and content schemas
- Locale configuration and UI dictionaries
- Theme configuration, semantic tokens, and preference scripts
- SEO helpers, sitemap, RSS, robots
- Frontend tooling, tests, and CI for this repository
- Static build output and public assets

Must not own:

- Backend API contracts
- Database schemas or migrations
- Filament/CMS editorial workflows
- Server-side business mutations (until an adapter and contract are approved)

Reads from:

- Local repository content and dictionaries
- Public environment values such as `SITE_URL` and `PUBLIC_DEFAULT_THEME`

Writes to:

- Build artifacts in `dist/` only

Depends on:

- Astro 7, Vite, Tailwind CSS 4, approved Astro integrations, and quality tooling

Exposes:

- Public static HTML routes and feed/sitemap assets

Consumes:

- Lead intake through the same-origin Worker API

### lead-worker (`clt-barq-digital-site`)

Owns lead request validation, Turnstile verification, intake rate limiting and the provider adapter contract. The Worker hands off an accepted request to the configured private delivery adapter and has no lead database. The site build and static assets remain independently served.

## Cross-application dependencies

| From | To          | Dependency                  | Contract                                    | Notes                                                         |
| ---- | ----------- | --------------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| site | lead-worker | Same-origin lead submission | [Lead intake](API-CONTRACTS.md#lead-intake) | Real provider integration pending approval and receipt checks |

## Implementation rule

No repository may implement functionality owned by another repository unless the ownership is updated here first.
