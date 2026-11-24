# Astro Frontend Engineering Standard

> **Package status:** Managed organization standard.  
> **Framework baseline:** Astro 7.x (latest supported stable minor), Node.js 24 LTS, Vite 8, TypeScript strictest, Tailwind CSS 4.  
> **Primary use:** Informational, marketing, portfolio, content-heavy, and CMS-driven public websites.  
> **Authority:** This document operates under the company Project Start SOP and project-specific system documentation.

## SOP traceability

This standard defines **how** Astro work is implemented. It does not independently define **what** must be built. Before implementation, the requested work must be traceable to:

- project or product scope
- application/repository ownership
- Feature ID
- approved route/page inventory
- milestone and acceptance criteria
- content ownership and freshness model
- locale and SEO requirements
- approved rendering mode
- API/CMS contract when applicable

When required context is missing, Cursor must return a readiness report and must not invent architecture or content contracts.

---

# CONTRIBUTING — Astro Frontend Engineering Standards

**Baseline:** Astro 7.x (latest supported stable minor), TypeScript `strictest`, Tailwind CSS 4.x  
**Conditional client layer:** Vue 3 islands  
**Interactive primitives:** project-owned shadcn-vue source built on Reka UI
**Testing:** Astro Check, Vue TSC where Vue exists, Vitest, Playwright

## Purpose

This document is the primary source of truth for frontend engineering behavior in Astro projects.

It exists to keep informational websites, landing pages, portfolio sites, content-heavy websites, and suitable CMS-driven projects:

- architecturally consistent
- content-first and performance-conscious
- accessible and SEO-ready
- maintainable by multiple developers
- safe for bilingual Arabic/English delivery
- predictable under AI-assisted development
- aligned with Astro rather than treating Astro as a smaller Nuxt application

Use:

- `STRUCTURE.md` for file placement and folder boundaries
- `COMPONENTS.md` for component and island design
- `INTEGRATIONS.md` for package and integration policy
- `DATA-AND-CONTENT.md` for CMS, API, and content access
- `RENDERING.md` for static, on-demand, island, and caching decisions
- `I18N-AND-SEO.md` for locale, RTL, metadata, and indexability
- `STYLING.md` for tokens and CSS rules
- `TESTING.md` for quality gates
- `FRONTEND-AI.md` for coding-agent behavior
- `PR-REVIEW-CHECKLIST.md` for pull-request review

Do not turn supporting files into competing sources of truth. If two documents appear to conflict, this document governs engineering behavior and the more specialized document clarifies implementation.

---

## 1. Project suitability

Astro is the preferred choice when the product is primarily content and navigation rather than long-lived client application state.

### Suitable by default

- corporate and brand websites
- service websites
- landing pages and campaigns
- personal and portfolio websites
- blogs, magazines, documentation, and knowledge sites
- multilingual informational websites
- marketing sites connected to a headless CMS
- directories and catalogues whose primary output is indexable content
- mostly static websites with a small number of interactive widgets

### Requires explicit architecture review

- authenticated account areas attached to a marketing website
- frequently changing catalogue data
- CMS preview environments
- pages with user-specific data
- server-side forms, personalization, or protected content
- large sites with thousands of generated routes

### Usually not suitable as the primary frontend

Prefer Nuxt or another application-oriented framework for:

- dashboards and internal systems
- highly interactive SaaS applications
- applications with shared client state across many routes
- real-time collaboration interfaces
- complex authenticated workflows
- client-heavy data grids and application shells
- products where most of the UI must hydrate immediately

Do not select Astro only because a site has pages. Select it because most pages can be delivered as HTML with little or no client JavaScript.

---

## 2. Core engineering philosophy

### 2.1 Consistency over personal style

A technically valid pattern is not automatically acceptable. Shared conventions, predictable responsibility boundaries, and low architectural drift are more valuable than individual preferences.

### 2.2 HTML first, JavaScript by exception

The default output is server- or build-rendered HTML.

Every client script and hydrated component must justify:

- why HTML and CSS are insufficient
- why a small local script is insufficient
- why the interaction cannot be deferred
- why the selected hydration directive is appropriate

Do not hydrate a component because it was written in Vue. Hydrate it only because the browser must execute its behavior.

### 2.3 Astro first, Vue by exception

Use `.astro` components for layouts, content, sections, navigation structure, cards, headings, and static form markup.

Use Vue only for cohesive interactive islands that need reactive state, lifecycle behavior, or a Vue-specific accessible primitive.

Do not convert ordinary markup into Vue for familiarity.

### 2.4 Built-in capability before dependencies

Use this order:

1. semantic HTML, CSS, and browser platform features
2. Astro built-ins
3. an existing Astro Component, UI Primitive, or Composite Pattern
4. shadcn-vue/Reka UI through an approved Vue Island
5. a new dependency or custom implementation after documented review

### 2.5 Split by responsibility, not DOM depth

Create files based on:

- meaning
- behavior
- reuse
- isolated complexity
- ownership
- testability

Do not create files because markup is nested, a section is visually separated, or an AI assistant proposed smaller files.

### 2.6 Pages orchestrate

A page is a route-level orchestrator.

A page may:

- read route parameters and locale
- call typed data services
- prepare route metadata
- select a layout
- compose meaningful sections
- handle route-level not-found or redirect behavior

A page must not become:

- a raw networking layer
- a collection of duplicated card internals
- a large data-mapping module
- a client-state application shell
- a dumping ground for scripts and unrelated logic

### 2.7 AI accelerates; humans retain authority

AI may implement, refactor, test, document, and review.

AI must not independently redefine:

- project structure
- route architecture
- content ownership
- rendering mode
- integration policy
- locale strategy
- metadata strategy
- design tokens
- shared component APIs

---

## 3. Approved baseline

### Required

- Astro
- TypeScript with `astro/tsconfigs/strictest`
- Tailwind CSS 4 through `@tailwindcss/vite`
- Prettier with Astro support
- ESLint with Astro support
- `astro check`
- Vitest
- Playwright
- Zod for shared runtime/form validation where project input crosses a trust boundary

### Approved when required

- `@astrojs/vue`
- Vue 3
- shadcn-vue source components
- Reka UI
- Embla Carousel for approved interactive carousels
- vee-validate for forms whose interaction complexity justifies it
- `@vueuse/core` inside Vue islands only
- `@astrojs/sitemap`
- `@astrojs/mdx`
- an official deployment adapter
- Astro Actions for server-rendered form workflows

### Default exclusions

Do not add by default:

- React only to consume React UI libraries
- multiple client UI frameworks
- a global client store
- Nuxt UI as a permanent Astro dependency
- another component library alongside the approved shadcn-vue source
- animation libraries for basic transitions
- client routers for ordinary website navigation
- large carousel or form libraries without measured need

`INTEGRATIONS.md` defines the approval process.

---

## 4. Responsibility boundaries

### Pages

Pages own route-level orchestration and metadata.

### Layouts

Layouts own document shells, global head defaults, skip links, header/footer composition, locale direction, and page-wide structural concerns.

Layouts must not fetch page-specific data or contain feature-specific business logic.

### `components/astro`

Contains Astro Components for static layout, sections, content, SEO, and CSS-only motion. These components require no Client State.

### `components/ui`

Contains reviewed, project-owned shadcn-vue UI Primitives. It does not contain project sections or business content.

### `components/islands`

Contains Vue Island boundaries and tightly local Vue children. Group controls that share state under one Island.

### `components/patterns`

Contains Composite Patterns such as coordinated form or carousel compositions (`ContactForm.vue`, `TestimonialsCarousel.vue`, `FAQAccordion.vue`). Hydrated header chrome prefers `components/islands/interactive/HeaderChrome.vue` over a parallel pattern.

### `lib/api`

Owns HTTP clients, endpoint functions, transport errors, request options, and network policy.

### `lib/content`

Owns Content Collection loaders, content queries, CMS loaders, and content-specific transformations.

### `lib/mappers`

Owns explicit conversion between transport/content shapes and view-facing models.

### `lib/seo`

Owns reusable metadata factories, canonical helpers, localized alternate generation, and structured-data builders.

### `lib/schemas`

Owns runtime schemas for external data and shared validation.

### `utils`

Contains small pure utilities. It must not become a location for networking, state, feature workflows, or DOM behavior.

---

## 5. Component creation rules

Create a component only when it provides at least one of:

- meaningful reusable API
- isolated interaction
- isolated complexity
- repeated visual contract
- testable responsibility
- content or page meaning
- accessibility behavior that should be centralized

Do not create components that are only:

- a `div` or `section` with classes
- a slot shell with no enforced contract
- a grid wrapper used once
- a renamed HTML element
- an unnecessary proxy around another component

Wrapper components are acceptable when they enforce genuine design-system value such as consistent spacing, heading relationships, accessible labeling, or a stable variant API.

Names must describe meaning, not structure. Avoid `Wrapper`, `Holder`, `Inner`, `Box`, and vague `Content` names.

See `COMPONENTS.md` for detailed rules.

---

## 6. Client JavaScript and island rules

### 6.1 No hydration by default

Framework components without a `client:*` Client Directive render as Server-rendered HTML. Use this when no browser behavior is required; prefer an Astro Component for new static work.

### 6.2 Hydration priority

Use the least aggressive directive that meets the interaction requirement:

1. no directive
2. `client:visible` for below-the-fold interaction
3. `client:idle` for non-critical interaction
4. `client:media` for genuinely responsive-only behavior
5. `client:load` for immediate critical interaction
6. `client:only="vue"` only as a documented Browser API exception

Accessibility-critical controls that must work immediately, such as the primary mobile menu, may require `client:load`. Below-the-fold carousels normally use `client:visible`.

### 6.3 Cohesive islands

Do not create several separately hydrated components that share the same state. Group them into one island boundary with internal Vue components.

The Island boundary follows shared state and behavior, not visible element count. Do not convert a page or static section into Vue because one nested control is interactive.

### 6.4 Browser APIs

Do not access `window`, `document`, `localStorage`, `sessionStorage`, or media APIs during server rendering or module initialization.

Use Vue lifecycle hooks, guarded scripts, or Astro inline scripts at the correct execution time.

### 6.5 Deterministic server output

Do not render uncontrolled values such as `Date.now()`, `Math.random()`, browser-only locale output, or unstable IDs into server HTML.

---

## 7. Data and content rules

### 7.1 No ad hoc networking in UI

Pages may call named service or content-query functions in frontmatter, but must not contain raw endpoint construction, authentication headers, retries, response parsing, or repeated `fetch()` logic.

Astro components and Vue UI components must not call backend APIs directly unless the component is an explicitly approved self-contained interactive island and the call still goes through `lib/api`.

### 7.2 Choose content mode deliberately

Preferred order:

1. local typed content
2. build-time Content Collection
3. remote build-time loader
4. rebuild webhook after CMS publication
5. live collection or on-demand data when freshness requires it
6. client-side fetching only when the user interaction genuinely requires it

### 7.3 Validate external data

Data from CMSs and APIs must be typed and validated at an appropriate boundary. Do not trust generated TypeScript types alone when runtime data can be malformed.

### 7.4 Separate transport from view models

Use DTOs or content entry types for external shapes. Use mappers when the UI needs renamed, combined, derived, or normalized fields.

### 7.5 Explicit states

Dynamic interfaces must define loading, empty, success, validation, and error states where applicable.

See `DATA-AND-CONTENT.md`.

---

## 8. Rendering rules

- static output is the default
- individual on-demand routes require documented justification
- server output for the entire project requires architecture approval
- server islands are for isolated dynamic or personalized HTML, not routine content
- client islands are for browser interaction, not data freshness alone
- an official adapter is required for on-demand rendering and server features
- caching policy must be explicit for live content

Do not choose SSR because a CMS exists. A CMS-backed website can remain fully static through build-time loading and rebuild hooks.

See `RENDERING.md`.

---

## 9. TypeScript rules

- extend `astro/tsconfigs/strictest`
- avoid `any`
- prefer `unknown` with narrowing for untrusted input
- use `import type` for type-only imports
- type Astro props with an explicit `Props` interface
- type Vue props, emits, exposed APIs, and model values
- validate environment variables
- type API request and response contracts
- use discriminated unions for meaningful UI states
- do not silence errors with broad casts

Astro's development and build transformation do not replace explicit type checking. `astro check` is required. Where Vue files exist, `vue-tsc --noEmit` is required.

---

## 10. Accessibility rules

Accessibility is a release requirement.

Minimum rules:

- use semantic HTML before ARIA
- provide one logical `h1` per route unless a documented exception exists
- preserve heading order
- ensure keyboard operation for all interactions
- provide visible focus states
- label all form controls
- provide descriptive errors and associate them with fields
- use meaningful link text
- give informative images accurate `alt`; decorative images use `alt=""`
- support reduced motion
- maintain adequate color contrast
- avoid inaccessible custom controls

Use shadcn-vue/Reka UI for complex interactive primitives when it reduces accessibility risk, and test the result. Do not rebuild focus traps, dialogs, dropdowns, or keyboard models manually without a documented requirement.

---

## 11. SEO and internationalization rules

All active locales are first-class deliverables.

- locale strategy is decided before page implementation
- `lang` and `dir` must be set at document level
- Arabic layouts must be tested as RTL, not visually patched after completion
- every indexable route requires title, description, canonical, and locale alternates where applicable
- Open Graph defaults and route overrides must exist
- sitemap and robots policy must be explicit
- structured data must match visible content
- localized routes must not accidentally canonicalize to another language
- translation fallback must be deliberate and documented

See `I18N-AND-SEO.md`.

---

## 12. Styling rules

- Tailwind CSS 4 is the **complete** default styling layer for ordinary UI
- Prefer utilities + CVA/`cn` over Pure/Raw CSS; avoid component `<style>` except for tokens/theme consumers, view transitions, keyframes, rich-text descendants, or approved integration selectors
- design tokens live in CSS theme variables
- use logical CSS properties and direction-aware utilities
- avoid locale-specific duplicated templates
- parent components own layout spacing where practical
- use `gap` instead of scattered child margins
- arbitrary values require genuine design-token exceptions
- avoid `!important`
- do not overuse `@apply`
- global CSS is limited to reset, tokens, typography (generated content), theme, view transitions, and cross-cutting base rules

See `STYLING.md`.

---

## 13. Images, fonts, icons, and media

### Images

- keep local processable images inside `src/assets` or near their content
- use Astro's `Image` or `Picture` components for processed images
- use `public` only for files intentionally served without transformation
- define allowed remote image sources
- avoid shipping assets far larger than their rendered size
- set width/height behavior to prevent layout shift
- do not lazy-load the primary LCP image
- lazy-load below-the-fold media

### SVG

- inline small trusted icons and critical compact brand marks
- do not inject raw SVG strings from a CMS or user input
- reference large SVGs by URL when inline markup would bloat HTML
- use raster output where vector behavior is unnecessary

### Fonts

- prefer Astro Fonts API self-hosting (no Google Fonts CSS CDN `@import`)
- bilingual baseline pairing: Tajawal (`--font-tajawal`) for `ar`, Manrope (`--font-manrope`) for `en` via Google provider unless a project ADR supersedes
- limit weights and styles; preload only the active locale family
- define robust fallbacks
- test Arabic and Latin metrics together

### Icons

Use `astro-icon` with locally installed Iconify data as the default:

- `@iconify-json/lucide` provides interface, navigation, action, status, and decorative icons
- `@iconify-json/simple-icons` is reserved for company and platform logos
- icon SVG is rendered by Astro; do not add runtime Iconify fetching, a CDN, an icon font, or an icon client bundle
- use project-owned SVGs under `src/assets/icons` (`astro-icon` `iconDir`) only for bespoke or unavailable icons
- hide decorative icons from assistive technology; give meaningful standalone icons an accessible name

Do not mix additional icon families or use brand-logo collections as general interface icons.

---

## 14. Security and privacy

- never expose secrets through `PUBLIC_` variables or client bundles
- use `astro:env/server` for secrets and `astro:env/client` only for intentionally public values
- sanitize or safely render CMS rich text
- never inject untrusted HTML, script, or SVG
- apply a Content Security Policy appropriate to the deployment
- load analytics and third-party scripts only after approval; follow GA4 enable/disable/mode env contract; honor stored `denied` via baseline CookieConsent
- minimize personal data collected through forms
- validate server-side even when client validation exists
- do not store sensitive data in browser storage without an approved requirement
- avoid logging tokens, form contents, or personal data

---

## 15. Performance rules

Performance is architectural, not final polish.

- ship zero client JavaScript for static sections
- avoid client hydration above the fold unless essential
- monitor JavaScript added by each island
- optimize the LCP asset and hero structure
- prevent CLS with stable dimensions
- defer non-critical third-party scripts
- avoid oversized fonts and images
- avoid nested islands that duplicate framework runtime work
- prefer CSS transitions and native behavior over animation libraries
- measure production builds, not only development mode

Each project must define practical performance budgets appropriate to its design and audience. Budget regressions require review, not silent acceptance.

---

## 16. Dependency and integration policy

A new package must demonstrate:

- a repeated or material problem
- no adequate built-in or approved solution
- active maintenance and compatible licensing
- acceptable client and build impact
- acceptable security posture
- clear ownership and removal path

A dependency must not be added merely because it shortens a small function.

Use `INTEGRATIONS.md` before changing dependencies.

---

## 17. Engineering workflow

Before implementation:

1. confirm Astro is suitable for the project
2. confirm page inventory and route map
3. confirm locale, content source, SEO, analytics, and theme scope
4. freeze tokens, layout shell, and component taxonomy
5. decide static versus on-demand rendering per route

During implementation:

1. use an issue and dedicated branch
2. inspect existing patterns before creating files
3. make the smallest coherent change
4. keep pages readable and imports explicit
5. add tests at the appropriate layer
6. run all required checks
7. document architectural exceptions

Before a Pull Request containing new UI:

- classify each component as Astro Component, UI Primitive, Vue Island, or Composite Pattern
- explain why Vue is required and why the selected Client Directive is the least aggressive option
- list every new dependency and the package manager used
- attach Light and Dark screenshots
- attach LTR and RTL screenshots or a recording for direction-sensitive interaction
- test keyboard navigation, Mobile and Desktop behavior
- confirm no console errors or Hydration warnings
- run `npm run validate` and `npm run build` (and `verify:*` when routes/output changed) — not mutating `fix:*` as verification

Pull requests must be focused. Do not combine unrelated refactors, dependency upgrades, content edits, and feature work unless they are inseparable.

---

## 18. Required validation

The exact scripts may vary, but the repository must provide layered equivalents:

```bash
npm run validate    # format:check, lint, astro check, vue-tsc, unit tests
npm run build       # artifact only (no embedded typecheck when validate exists)
npm run verify      # budget + links + e2e (assumes dist/)
npm run ci:local    # validate && build && verify
```

Legacy one-shot habits (`build` embedding `astro check`, `test:e2e` rebuilding) should migrate to this model (see `TESTING.md` §15–17).

A PR is not complete because the page looks correct locally.

---

## 19. Definition of done

A change is complete only when:

- it follows the approved structure
- Astro remains the default rendering layer
- client JavaScript is justified and minimized
- data access follows the approved boundary
- all active locales are complete
- metadata and indexability are correct
- responsive and RTL behavior are verified
- keyboard and focus behavior are verified
- images and fonts are optimized
- required tests pass
- the production build succeeds
- no critical review comments remain
- architectural exceptions are documented

---

## 20. Final rule

Create a file, abstraction, island, dependency, or server route only when it improves at least one of:

- meaning
- reuse
- behavior isolation
- complexity isolation
- accessibility
- performance
- security
- maintainability

Do not reproduce application-framework habits inside Astro when plain HTML, CSS, and build-time rendering solve the problem better.


---

## 21. Complete-feature rule

A feature is not complete when only its visible section exists. The approved scope must include, as applicable:

- routes and localized equivalents
- data/content contracts
- loading, validation, empty, error, and success behavior
- SEO metadata and structured data
- responsive and RTL behavior
- accessibility and keyboard behavior
- CMS editor requirements
- analytics events approved for the feature
- tests and documentation

Do not use placeholder or fabricated production content unless the task explicitly authorizes it. Missing content is a readiness problem, not a reason to invent data.

## 22. Multi-repository rule

When Laravel or another backend owns the data, Astro consumes the approved contract. It must not duplicate domain rules, publication workflows, or permission logic.

## 23. Project review cadence

Run architecture and documentation drift review after major route families, CMS model changes, framework upgrades, or several milestones.
