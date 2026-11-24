# Cursor Rule — Astro Data and Content

## Source order

Prefer local/static content, Content Collections, build-time CMS/API loading, and rebuild webhooks before live or client fetching.

## Boundaries

- pages call named query/service functions
- raw endpoints, headers, retries, and parsing stay in `lib/api`
- loaders and content queries stay in `lib/content`
- DTO/content shapes are validated at runtime when untrusted
- UI consumes normalized view models
- resolve content in Astro whenever possible
- pass only small serializable props to Vue Islands
- never pass secrets or server-only data to Client Code
- keep content schemas in `lib/schemas` and form schemas in `lib/validation`

## Forms

Use native HTML Form and Astro for simple submissions. Use a Vue Island with Zod and optional vee-validate only when interaction complexity requires it. Server Validation remains mandatory.

## Safety

Never inject untrusted HTML, script, CSS, or SVG. Validate links, media sources, locale, publication state, and stable IDs. Keep important content in Server-rendered HTML rather than fetching it after Hydration.

## Missing integration

Do not use fake runtime data to hide a missing API, SDK, CMS field, loader, or content source unless the task explicitly authorizes placeholders.

## Laravel/Filament

Laravel owns database/editorial/business workflows; Astro owns public rendering, route generation, validation/mapping, and SEO.
