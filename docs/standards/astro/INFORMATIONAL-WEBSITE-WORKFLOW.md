# Astro Informational Website Delivery Workflow

## Phase 0 — Project and framework readiness

Deliverables:

- scope and audience
- Astro suitability verdict
- repository/application map
- locales
- page inventory
- content owners
- deployment target
- analytics/legal/form/consent scope (GA4 Measurement ID + disable path; baseline CookieConsent opt-out unless banner disabled via env)
- package manager / lockfile policy (starter baseline: npm + `package-lock.json`)

No implementation begins before approval.

## Phase 1 — System freeze

Freeze:

- document/layout shell
- navigation/footer contracts
- design tokens and typography
- responsive strategy
- theme strategy
- component taxonomy (`core` / `layout` / `astro` / `ui` / `islands` / `patterns`)
- official UI stack (Astro + Tailwind CSS 4 + Vue Islands + shadcn-vue/Reka UI)
- image/font/icon policy (bilingual baseline: Tajawal for `ar` + Manrope for `en` via Astro Fonts; preload active locale only)
- accessibility baseline
- which optional recipes under `docs/recipes/` are in scope (host redirects, CSP, CMS, Consent Mode v2 / privacy extensions, contact form, header alternative)

## Phase 2 — Routes, content, and SEO

Create:

- route map
- page inventory
- content ownership map
- localized slug map
- metadata matrix
- canonical/alternate policy
- sitemap/robots policy

Pages may exist only as approved shells.

## Phase 3 — Data and CMS integration

Define:

- local collections and schemas
- Laravel/CMS API contracts
- DTOs, runtime schemas, and mappers
- publication and preview rules
- rebuild webhooks
- media and rich-text rendering
- error/fallback behavior

## Phase 4 — Shared implementation system

Build only meaningful:

- Astro Components for static layout, sections, content, SEO, and motion
- reviewed shadcn-vue UI Primitives
- Composite Patterns and approved Vue Islands
- route-level SEO helpers
- form integration boundaries with Zod / optional vee-validate

## Phase 5 — Controlled page completion

Complete pages by route family, including:

- approved content
- all locales
- responsive/RTL
- metadata
- forms and interactions
- testing
- documentation

## Phase 6 — Hardening and launch

Required:

- content and broken-link audit
- SEO and locale audit
- accessibility review
- performance budget check
- security/privacy review
- production build and E2E
- analytics verification (configured ⇒ inject by default; reject ⇒ stopped; disabled/unset ⇒ absent)
- deployment and rollback validation

## Phase 7 — Post-launch operations

- monitor errors and Core Web Vitals
- validate sitemap/indexing
- verify CMS rebuilds
- record content/model gaps
- create improvement issues rather than ad hoc changes
