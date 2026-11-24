# Astro Integrations and Dependency Governance

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

# Integrations and Dependency Policy

## Purpose

This document defines the approved Astro ecosystem, when each integration is allowed, and how new dependencies are evaluated.

The goal is not to avoid dependencies entirely. The goal is to keep each project small, explainable, secure, and aligned with Astro's HTML-first architecture.

---

## 1. Approval levels

### Required baseline

Installed in every governed project:

- `astro`
- `typescript`
- `tailwindcss`
- `@tailwindcss/vite`
- `astro-icon`
- `@iconify-json/lucide`
- `@iconify-json/simple-icons`
- ESLint with Astro support
- Prettier with Astro support
- `vitest`
- `@playwright/test`

### Approved when the project requires them

- `@astrojs/vue`
- `vue`
- `shadcn-vue`
- `reka-ui`
- Embla Carousel
- Zod
- `vee-validate`
- `@vueuse/core`
- `@astrojs/sitemap`
- `@astrojs/mdx`
- an official Astro adapter
- an approved monitoring or analytics integration
- an accessibility test helper such as `@axe-core/playwright`

### Requires architecture review

- Astro Actions
- Partytown
- view-transition libraries
- search indexing libraries
- form libraries other than the approved optional `vee-validate`
- carousel libraries other than approved Embla usage
- map SDKs
- animation libraries
- third-party CMS loaders
- icon libraries that ship client runtime
- any package that adds a second UI framework

### Rejected by default

- React only to use React component libraries
- multiple client frameworks in one project
- global state libraries for ordinary informational sites
- client routers for standard website navigation
- unmaintained packages
- packages duplicating Astro or browser capabilities
- unreviewed shadcn registries or generated source
- packages that inject untrusted HTML or scripts without a security design

---

## 2. Approved framework integrations

### `@astrojs/vue`

Use only when the project contains justified Vue islands.

Rules:

- do not install preemptively
- use one client framework only
- keep hydrated boundaries under `src/components/islands` or approved Composite Patterns under `src/components/patterns`
- do not create a global app shell
- remove the integration if no Vue remains

### Reka UI

Use for complex accessible Vue primitives.

Rules:

- imports are restricted to internal interactive component implementation
- pages and Astro sections consume approved wrappers, not raw Reka primitives
- direction must be configured for RTL/LTR projects
- component behavior must be tested in a real browser
- unused primitives are not copied into the repository

### `@vueuse/core`

Use inside Vue islands when a well-tested helper replaces non-trivial browser code.

Acceptable examples:

- event listener lifecycle
- media-query observation
- debouncing or throttling
- element visibility
- browser storage for a non-sensitive preference

Do not use it to turn trivial local logic into abstraction or to introduce browser state into static pages.

---

## 3. Astro integrations

### `@astrojs/sitemap`

Recommended for indexable public websites.

Requirements:

- `site` must be configured
- excluded, redirected, private, and non-canonical routes must be reviewed
- multilingual sitemap configuration must align with the locale strategy
- dynamic CMS routes must be available to the integration at build time or handled by an approved alternative

### `@astrojs/mdx`

Use only when Markdown content genuinely needs embedded components or JSX-like composition.

Prefer plain Markdown when possible. MDX increases authoring power and execution risk, so:

- only trusted authors may edit MDX
- imported components are allowlisted
- content schemas remain required
- avoid embedding arbitrary client islands inside articles

### Deployment adapters

Install an official adapter only when the project needs on-demand rendering, server islands, Actions, API routes, or another server feature.

Adapter selection must follow the actual deployment platform. Do not install a Node adapter for a fully static site without a server requirement.

Document:

- target platform
- output mode
- runtime limitations
- caching behavior
- environment-variable behavior
- image-service behavior

### Partytown

Consider only when approved third-party scripts materially affect the main thread and are compatible with worker execution.

It is not a substitute for removing unnecessary scripts.

---

## 4. Tailwind CSS integration

Use Tailwind CSS 4 through the Vite plugin:

```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Design tokens belong in CSS using `@theme` and custom properties.

Do not add an obsolete Astro Tailwind integration intended for earlier Tailwind versions when the Vite plugin is the approved path.

---

## 5. UI library policy

### Official architecture for new projects

```text
Astro
+ Tailwind CSS 4
+ Vue 3 Islands
+ shadcn-vue
+ Reka UI
+ Embla Carousel
+ Zod
+ vee-validate when needed
+ astro-icon + Iconify
+ Lucide icons
+ Simple Icons for company and platform logos
```

### shadcn-vue

Status: approved primary source of UI Primitives for Astro projects.

A generated component is added to project source and becomes project-owned code. It may be customized to the Design System. Adoption requires:

- reviewing all dependencies
- preserving existing project naming and modified source
- replacing generated hardcoded values with semantic Design Tokens
- confirming semantic HTML
- testing keyboard and focus behavior
- testing RTL
- removing unused variants and code
- adding only the requested component
- reviewing the generated diff before replacing any existing UI Primitive

Nuxt UI is not approved as a permanent dependency in new Astro projects. It may remain only as a documented migration exception in an existing project.

### UI stack responsibilities

| Tool | Use | Do not use | Runtime and Hydration |
|---|---|---|---|
| `@astrojs/vue` / Vue 3 | Cohesive browser state and complex events | Static sections or a global app shell | Server-renders without a Client Directive; Hydration occurs only with `client:*` |
| shadcn-vue | Project-owned UI Primitive source | Unreviewed bulk generation or a second design system | Depends on the caller; interactive use belongs inside a Vue Island |
| Reka UI | Accessible behavior for dialogs, menus, selects, tabs, and similar controls | Direct page imports or hand-replacing simple HTML | Interactive behavior runs after Vue Hydration |
| Embla Carousel | Approved Carousel or interactive Auto Scroll requiring drag/control | A layout better expressed as a grid or CSS-only Marquee | Client-side; defer with `client:visible` unless immediately critical |
| Zod | Shared validation at server/trust boundaries and reusable form schemas | TypeScript-only assumptions about untrusted runtime input | Server by default; browser-safe schema subsets may support Client Validation |
| `vee-validate` | Complex Vue form state and validation UX | Simple native forms | Client-side inside a hydrated Form Island |
| `astro-icon` + Iconify | Default server/build-time icon strategy using Lucide, with Simple Icons for company and platform logos | Mixed UI families, runtime fetching, icon fonts, or using brand icons as general UI icons | Inlines SVG into HTML with no icon client runtime |

No fixed package versions are declared here. Use the repository's existing compatible versions and version-pinning policy.

### CSS-only component libraries

Libraries such as theme-class systems may speed prototypes but are not approved as the core design system for brand-driven projects unless the design lead accepts their visual and token constraints.

### Web Components libraries

May be considered for framework independence, but require review for:

- styling and theming
- SSR output
- accessibility
- bundle and registration cost
- form participation
- RTL support

---

## 6. Icons

The default icon strategy for every Astro project is:

- `astro-icon` as the Astro integration and `Icon` component
- Iconify data installed as project dependencies; never fetched from a runtime API
- `@iconify-json/lucide` as the primary UI icon collection
- `@iconify-json/simple-icons` only for company, product, service, and platform logos

Install the baseline packages with the repository's package manager:

```sh
npm install astro-icon @iconify-json/lucide @iconify-json/simple-icons
```

Register the integration:

```ts
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [icon()],
});
```

Use statically identifiable icon names in Astro components:

```astro
---
import { Icon } from 'astro-icon/components';
---

<Icon name="lucide:search" aria-hidden="true" />
<Icon name="simple-icons:github" title="GitHub" role="img" />
```

Project-owned SVG files under `src/assets/icons/` (`astro-icon` `iconDir`) remain allowed for custom icons that do not exist in the approved collections, require bespoke artwork, or need tightly controlled SVG markup. Record any additional Iconify collection as a dependency exception.

Rules:

- use Lucide consistently for interface actions, navigation, status, and decorative UI
- use Simple Icons only for company and platform brand marks; follow brand and trademark requirements
- do not substitute Simple Icons for general interface icons
- do not add another icon family when Lucide contains a suitable icon
- do not load an icon font
- do not use Iconify's runtime API, CDN, or client package to fetch icons
- do not ship an entire icon collection to the client
- keep icon names statically discoverable; explicitly allowlist icons when names must be dynamic
- decorative icons use appropriate accessible hiding
- meaningful icons need text or an accessible name

---

## 7. Forms and validation

Preferred order:

1. native HTML validation and server handling
2. shared Zod schemas
3. Astro Actions for an approved server-rendered project
4. Vue island for complex conditional or multi-step interaction
5. `vee-validate` only when complex Vue form state justifies it

Client validation never replaces server validation.

When the existing backend is Laravel or another service, prefer posting to the stable backend/API rather than duplicating domain logic in Astro.

---

## 8. Analytics, monitoring, and third-party scripts

Every script must have:

- business owner
- purpose
- data collected
- consent classification
- loading strategy
- environment rules
- removal procedure

Rules:

- production-only by default
- no duplicate analytics tools
- defer or delay non-critical scripts
- for GA4: use official `gtag.js` only; inject in production when a valid Measurement ID is configured unless explicitly disabled (`PUBLIC_GOOGLE_ANALYTICS_ENABLED=false`, `PUBLIC_GOOGLE_ANALYTICS_MODE=off`, or unset ID) or mode/preference blocks load (`opt-out` honors `denied`; `opt-in` requires `granted`)
- baseline CookieConsent follows `PUBLIC_GOOGLE_ANALYTICS_MODE` (default opt-out may load before first choice); Consent Mode v2 / privacy extensions remain opt-in recipes — see `ANALYTICS-AND-THIRD-PARTY.md`
- do not expose sensitive form or user data
- test Content Security Policy compatibility (baseline does not claim CSP-compliant; Astro-native CSP is deferred)
- review impact on Core Web Vitals

Prefer server-side or privacy-preserving collection where it satisfies requirements.

Do not install analytics npm SDKs, CMS SDKs, or adapters into a static baseline without a Feature ID and dependency proposal. Host-neutral adoption guides for this starter live under `docs/recipes/`.

---

## 9. Animation and interaction libraries

Use CSS transitions and the Web Animations API first.

An animation dependency requires:

- interaction or storytelling value that native tools cannot reasonably provide
- reduced-motion support
- measured client impact
- cleanup behavior under navigation
- no blocking of initial rendering

GSAP or similar libraries may be approved for a focused premium interactive experience, but must not become the default for ordinary sections.

### Carousel and Marquee

Use shadcn-vue Carousel + Embla for an interactive Carousel requiring controls, drag, or programmatic state. A below-the-fold Carousel uses `client:visible`; `client:load` is reserved for immediately critical interaction. Do not enable autoplay by default.

Use Astro + CSS for a visual Marquee. Embla Auto Scroll is allowed only when drag, runtime controls, dynamic direction/speed, or interaction pause is required.

---

## 10. CMS integrations and loaders

Use a custom or third-party Content Collection loader only when it improves:

- schema validation
- caching
- incremental build behavior
- query consistency
- editorial preview

Review:

- maintenance and compatibility
- authentication model
- pagination
- rate limits
- draft handling
- webhook/rebuild flow
- image domain handling
- localization model
- failure behavior

A thin internal loader is often preferable to exposing a CMS SDK throughout the project.

---

## 11. Dependency evaluation record

A PR adding a package must include:

```md
### Dependency proposal

- Package:
- Problem solved:
- Why Astro/browser/internal tools are insufficient:
- Server or client:
- Estimated client impact:
- Maintenance status:
- License:
- Security considerations:
- Alternatives considered:
- Removal/migration path:
```

For substantial dependencies, create an architecture decision record.

Before installation, inspect the current `package.json`, lockfile, existing UI Primitives, framework integrations, and compatible peer dependencies. Use the repository's current package manager and add only the required package/component. Do not assume a package manager when the lockfile is absent; when the repository commits `package-lock.json` (Astro starter baseline), use **npm** / `npm ci` and do not introduce a second lockfile.

---

## 12. Update policy

- pin the supported major version intentionally
- commit the lock file
- review release notes before major upgrades
- upgrade framework and official integrations together when compatibility requires it
- do not combine broad dependency upgrades with unrelated features
- run the full validation suite after dependency changes
- remove unused packages promptly

Automated update PRs must still pass architectural review; a green CI result does not prove runtime or bundle suitability.

---

## 13. Final acceptance checklist

- [ ] A built-in solution was considered first.
- [ ] The package solves a material problem.
- [ ] Client impact is understood.
- [ ] The package is maintained and licensed appropriately.
- [ ] Security and privacy impact are reviewed.
- [ ] RTL and accessibility behavior are known.
- [ ] The integration has one clear ownership boundary.
- [ ] Configuration and usage are documented.
- [ ] Full checks pass.


---

## 14. Approval gate for missing capability

When a requested feature appears to require a package or SDK:

1. inspect existing project capability
2. inspect Astro/browser built-ins
3. inspect existing approved integrations
4. propose the dependency with alternatives
5. wait for approval
6. implement only after approval

Do not install a package merely to match an implementation from a Nuxt project.

## 15. Version alignment

Astro and official integrations must be reviewed and upgraded together when required. Major framework upgrades use a dedicated issue and must not be bundled with feature work.
