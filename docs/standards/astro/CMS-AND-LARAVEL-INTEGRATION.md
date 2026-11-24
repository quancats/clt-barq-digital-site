# Astro with Laravel and Filament CMS

## Purpose

Define a clean boundary when Astro renders the public informational site and Laravel/Filament manages content.

## Recommended ownership

### Laravel/Filament

- content entities and relationships
- editorial roles and permissions
- draft/review/published lifecycle
- localization publication state
- audit history
- media ownership and transformations
- API authorization
- signed rebuild webhook

### Astro

- route generation
- DTO validation and mapping
- localized public rendering
- SEO output
- static build and deployment
- safe rich-text rendering
- frontend error/fallback behavior

## API design

Prefer page/route-oriented read models when they reduce excessive frontend composition, while keeping stable reusable entities where needed. Contracts must include:

- IDs and stable slugs
- locale and translation identity
- publication state
- SEO fields
- media metadata
- section ordering
- timestamps used for freshness

## Rebuild workflow

```text
Editor publishes in Filament
→ backend validates publication
→ signed webhook triggers Astro build
→ Astro validates content schemas
→ build and tests run
→ deployment becomes active
```

## Preview

Preview requires protected on-demand access or a separate preview mechanism. Draft tokens and private content must not enter public static artifacts.

## CMS model estimation

Analysis of an existing Astro site may propose tables/resources, but visual repetition alone is not enough. The proposal must consider editor ownership, reusable entities, nested blocks, localization, ordering, publication, and media relationships.
