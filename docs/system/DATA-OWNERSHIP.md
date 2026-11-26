# Data Ownership

## Purpose

This document defines who owns data structures across applications and repositories.

## Rules

- No table without owner application.
- No relationship without business reason.
- No API exposing data without ownership clarity.
- No duplicated tables across backends unless explicitly documented.
- No repository creates migrations for data it does not own.
- Baseline template has no database; content is repository-owned files.

## Data ownership table

| Data object           | Type                     | Owner application | Owner domain    | Read by                                        | Written by         | Notes                                                              |
| --------------------- | ------------------------ | ----------------- | --------------- | ---------------------------------------------- | ------------------ | ------------------------------------------------------------------ |
| articles              | content collection files | site              | Content         | site build / public HTML                       | repository authors | `src/content/articles/{ar,en}`                                     |
| ui_dictionaries       | typed modules            | site              | LocaleSeo       | site pages/components                          | repository authors | `src/i18n/dictionaries/**`                                         |
| site_config           | env / constants          | site              | Platform        | site build and theme init                      | deploy config      | Includes `SITE_URL`, `PUBLIC_DEFAULT_THEME`                        |
| ui_component_registry | typed module             | site              | Platform        | catalog page / island                          | repository authors | `src/lib/ui/componentCatalog.ts`                                   |
| lead submission       | transient request        | lead-worker       | Lead operations | Worker and configured private delivery adapter | Site form visitor  | Provider retention, location and recipient access require approval |

The intake Worker keeps no lead records. Application logs emit a random correlation ID and an outcome code. The raw challenge token goes only to Cloudflare Siteverify. The provider adapter receives normalized fields and opaque deduplication keys. Review hosting and provider logging, retention, access and deletion obligations before controlled delivery. [Lead intake contract](API-CONTRACTS.md#lead-intake)

## Data object template

### articles

Type: Local Astro Content Collection (Markdown + trusted MDX)

Owner application: site

Owner domain: Content

Business purpose: Bilingual article content for the public site

Allowed readers: Astro build, public HTML consumers

Allowed writers: Repository content authors via PR

Related features: FEAT-CONTENT-001

Related APIs: None

Retention: Repository history

Audit needs: Git history

Migration ownership: N/A (no database)

Notes: Draft entries must not appear in production routes, sitemap, or RSS. MDX imports must pass the repository allowlist check.

### ui_dictionaries

Type: Typed TypeScript modules

Owner application: site

Owner domain: LocaleSeo

Business purpose: Shared UI strings for chrome and short page copy

Allowed readers: Astro pages and components

Allowed writers: Repository authors

Related features: FEAT-PLATFORM-001, FEAT-CONTENT-001

Related APIs: None

Retention: Repository history

Notes: Long-form articles must not live in dictionaries.

### site_config

Type: Environment and constants

Owner application: site

Owner domain: Platform

Business purpose: Build-time site identity, locale constants, and public theme default

Allowed readers: Astro config, SEO helpers, feeds, and theme initialization

Allowed writers: Deploy/environment owners

Related features: FEAT-PLATFORM-001

Related APIs: None

Notes: Production must set a real `SITE_URL`. `PUBLIC_DEFAULT_THEME` accepts `light`, `dark`, or `auto`. No secrets in baseline.

## Mobile local data ownership

Not applicable to this repository.
