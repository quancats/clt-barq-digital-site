# Dependency Register

## Required baseline

| Package                   | Purpose                | Server/Client | Status                     |
| ------------------------- | ---------------------- | ------------- | -------------------------- |
| astro                     | Framework              | build         | required                   |
| typescript                | Types                  | build         | required                   |
| @astrojs/check            | `astro check`          | build         | required                   |
| tailwindcss               | Styling                | build         | required                   |
| @tailwindcss/vite         | Tailwind 4 Vite plugin | build         | required                   |
| eslint (+ Astro plugin)   | Lint                   | build         | required                   |
| prettier (+ Astro plugin) | Format                 | build         | required                   |
| vitest                    | Unit tests             | build         | required                   |
| @playwright/test          | E2E tests              | build         | required                   |
| @axe-core/playwright      | Accessibility checks   | build         | approved for public sites  |
| @astrojs/sitemap          | Sitemap                | build         | approved for public sites  |
| @astrojs/rss              | RSS helper             | build         | approved for content sites |
| @astrojs/mdx              | MDX content authoring  | build         | approved (ADR-0005)        |

## Required icon baseline (Astro surfaces)

| Package                    | Purpose                                                       | Server/Client | Status              |
| -------------------------- | ------------------------------------------------------------- | ------------- | ------------------- |
| astro-icon                 | Astro icon integration (`Icon` + `iconDir: src/assets/icons`) | build         | required (ADR-0011) |
| @iconify-json/lucide       | Primary UI icon collection for Astro                          | build         | required (ADR-0011) |
| @iconify-json/simple-icons | Company / platform logos only                                 | build         | required (ADR-0011) |

These packages are pre-approved baseline and do not need a separate dependency proposal. Icon data stays local and renders through Astro; do not add Iconify CDN/runtime clients, icon fonts, or extra collections without an approved exception.

## Approved Vue / shadcn stack (catalog + HeaderChrome)

| Package                                                                          | Purpose                                                                               | Server/Client | Status                            |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------- | --------------------------------- |
| @astrojs/vue                                                                     | Vue island integration                                                                | build/client  | approved (ADR-0008)               |
| vue                                                                              | Island runtime                                                                        | client        | approved (ADR-0008)               |
| vue-tsc / @vue/tsconfig                                                          | Vue typecheck                                                                         | build         | approved                          |
| shadcn-vue                                                                       | CLI + owned UI primitives under `components/ui`                                       | build         | approved (ADR-0008)               |
| reka-ui                                                                          | Headless primitives used by shadcn-vue                                                | client        | approved (ADR-0008)               |
| embla-carousel-vue                                                               | Carousel demo                                                                         | client        | approved (catalog)                |
| vee-validate                                                                     | Local form demo validation                                                            | client        | approved (catalog)                |
| @vee-validate/zod                                                                | Zod bridge for form demo                                                              | client        | approved (catalog)                |
| zod                                                                              | Schema validation for form demo                                                       | client/build  | approved (catalog)                |
| vue-sonner                                                                       | Toast stack (Sonner; CLI toast deprecated)                                            | client        | approved (catalog)                |
| @lucide/vue                                                                      | Icons for Vue UI primitives/islands only (not Astro surfaces; see ADR-0011)           | client        | approved (catalog)                |
| clsx / tailwind-merge / class-variance-authority / tw-animate-css / @vueuse/core | shadcn-vue utility stack; CVA/`cn` also power Astro UI variants (`FEAT-PLATFORM-003`) | build/client  | approved (catalog + Astro UI kit) |

## Package manager

| Tool              | Status                                                                   |
| ----------------- | ------------------------------------------------------------------------ |
| npm               | Required for this template (`package-lock.json`, CI `npm ci`) (ADR-0017) |
| pnpm / Yarn / Bun | Not used in baseline; do not add a second lockfile                       |

## Explicitly not installed / not approved beyond catalog

| Package        | Reason                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------- |
| adapters       | Static only                                                                                     |
| CMS SDKs       | No CMS contract                                                                                 |
| analytics SDKs | GA4 uses official `gtag.js` snippet only (`FEAT-PLATFORM-007` / ADR-0014); no npm analytics SDK |

## Proposal rule

Any new dependency needs the Integrations proposal section and, when substantial, an ADR.
The Astro icon baseline (`astro-icon` + Lucide + Simple Icons) is pre-approved; additional icon families or client Iconify packages still require a proposal and exception.
Vue islands outside `/components` require a new Feature ID and island checklist update. Header chrome (`HeaderChrome`) is approved via FEAT-PLATFORM-004 / ADR-0010.
Host configs, consent UI, CMS SDKs, and adapters are documented as opt-in recipes under `docs/recipes/` (ADR-0017) — do not install them into the shared baseline without an adopting-project Feature ID.
