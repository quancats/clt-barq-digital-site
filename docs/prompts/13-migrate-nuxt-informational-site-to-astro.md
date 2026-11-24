# Cursor Prompt — Plan Nuxt Informational Site Migration to Astro

Analysis and plan only unless implementation is explicitly requested.

Inspect:

- routes, layouts, middleware, plugins
- Nuxt UI and app components
- composables/API layer
- Pinia usage
- i18n and metadata
- SSR/static behavior
- CMS/API integration
- client-only code and dependencies

Classify each part:

- Astro Component
- Astro focused script
- UI Primitive (`shadcn-vue`)
- Vue Island
- Composite Pattern
- retain in Nuxt/application boundary
- remove/replace

Map Nuxt UI components using the Astro replacement map in `COMPONENTS.md`. Do not retain Nuxt UI as a permanent Astro dependency unless documented as a temporary migration exception.

Produce route parity, component migration map, API/content plan, SEO/i18n parity, dependency plan, milestones, risks, and rollback.
