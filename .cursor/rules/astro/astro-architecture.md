# Cursor Rule — Astro Architecture

## Framework boundary

Astro is the default for content-first, public, indexable websites. Nuxt remains the preferred choice for app-like frontends with broad shared client state or complex authenticated workflows.

Official Astro UI stack for new projects:

```text
Astro
+ Tailwind CSS 4
+ Vue 3 Islands
+ shadcn-vue
+ Reka UI
+ Embla Carousel
+ Zod
+ vee-validate when needed
```

Astro is the site's primary framework. Vue is a limited interaction layer used through Islands, not the framework for the whole page.

## Architecture rules

- static output first
- pages are route-level orchestrators
- layouts own document shells only
- Astro Components are the default
- Vue exists only inside explicit cohesive Vue Islands or Composite Patterns
- UI Primitives live in `components/ui`
- data access belongs in `lib/api` or `lib/content`
- mappings belong in `lib/mappers`
- content/API runtime validation belongs in `lib/schemas`
- shared form schemas belong in `lib/validation`
- SEO helpers belong in `lib/seo`

## Forbidden behavior

- recreating a global Vue application
- converting static sections to Vue for familiarity
- importing project-aware patterns into UI Primitives
- raw networking in pages/components
- making the entire project server-rendered for one small dynamic need
- introducing client routers, global stores, React, or Nuxt UI by default
- using Astro when most routes require immediate Hydration

Flag a framework suitability review when the requested work crosses these boundaries.
