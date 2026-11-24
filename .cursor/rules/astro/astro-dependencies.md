# Cursor Rule — Astro Dependencies and Integrations

## Default order

1. semantic HTML/browser platform
2. Astro built-ins
3. existing Astro Component, UI Primitive, or Composite Pattern
4. approved official integration or reviewed shadcn-vue/Reka UI primitive
5. new package after review

## Approved interactive stack

When interaction is required, prefer:

- `@astrojs/vue` and Vue 3 for cohesive Vue Islands
- project-owned `shadcn-vue` UI Primitives
- Reka UI behind those primitives
- Embla Carousel for approved interactive carousels
- Zod for shared validation
- `vee-validate` only for complex Vue form state

Do not install Nuxt UI as a permanent Astro dependency. Do not install React only to consume a React component library.

## Required icon baseline

New governed Astro projects use:

- `astro-icon` as the Astro icon integration
- `@iconify-json/lucide` as the primary UI icon collection
- `@iconify-json/simple-icons` for company and platform logos only

These baseline packages are pre-approved and do not require a separate dependency proposal. Register `icon({ iconDir: 'src/assets/icons' })` in the Astro configuration and use `Icon` from `astro-icon/components`. Icon data must remain local and render through Astro; do not add a client Iconify package, CDN/runtime fetching, icon font, or another collection without an approved exception.

## Proposal required

Do not add packages, adapters, SDKs, integrations, client frameworks, lockfile changes, or generators without a documented proposal and approval.

The proposal must cover:

- problem and owner
- alternatives
- server/client impact
- bundle/build impact
- maintenance and license
- security/privacy
- RTL/accessibility
- migration/removal path

Use the repository's current package manager. When `package-lock.json` is committed (Astro starter baseline), use **npm** / `npm ci` and do not add a second lockfile. Outside the required baseline, do not install adapters, CMS SDKs, analytics npm SDKs, form backends, or additional icon packages preemptively — prefer documented recipes under `docs/recipes/` when the starter provides them.
