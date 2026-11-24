# Astro AI Execution Standard

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

# Frontend AI Operating Standard — Astro

## Purpose

This document converts the frontend governance bundle into strict execution behavior for Cursor and other coding agents.

It is not a second architecture guide.

AI must follow, in order:

1. `docs/standards/astro/01-standards/CONTRIBUTING.md`
2. `docs/standards/astro/01-standards/STRUCTURE.md`
3. the relevant specialized Astro standard
4. the rules under `.cursor/rules/astro/`
5. existing project patterns that do not conflict with the standards
6. the current task requirements

When task instructions conflict with repository standards, the agent must identify the conflict rather than silently invent a new pattern.

---

## 1. Default project assumptions

Assume the project is:

- Astro 7.x (latest supported stable minor)
- TypeScript `strictest`
- Tailwind CSS 4.x
- static output by default
- Arabic/English capable
- Astro-component first
- Vue 3 only for justified interactive islands
- shadcn-vue as the approved project-owned UI Primitive source
- Reka UI as the behavior layer under complex UI Primitives
- connected to local content, a CMS, or an external backend through typed boundaries

Do not assume Vue, shadcn-vue, Reka UI, an adapter, Actions, or runtime rendering is installed. Inspect the repository before using the approved stack.

---

## 2. Mandatory pre-edit inspection

Before changing code, inspect:

- relevant documentation
- neighboring files and naming patterns
- the page and layout ownership
- existing UI and app components
- current integrations and package manager
- content/API query layers
- locale and SEO helpers
- existing tests

Do not generate a parallel structure without inspecting the repository.

For an existing project, preserve established valid patterns. Correct architectural drift only when the task requires it or the drift would make the requested change unsafe.

---

## 3. Architecture behavior

AI must:

- keep pages as route-level orchestrators
- use `.astro` by default
- use explicit imports
- place static rendering in `components/astro`
- place shadcn-vue UI Primitives in `components/ui`
- place Vue Islands in `components/islands`
- place reusable Composite Patterns in `components/patterns`
- place content renderers in `components/astro/content`
- place networking in `lib/api`
- place collection/CMS queries in `lib/content`
- place mappings in `lib/mappers`
- place metadata logic in `lib/seo`
- avoid unnecessary files and wrapper-only abstractions

AI must not:

- convert static sections to Vue
- add a global Vue app
- add Pinia by default
- call raw endpoints inside UI components
- copy large generated component sets
- install Nuxt UI as the permanent Astro UI layer
- install React merely to consume a component available in Vue
- create utilities as a dumping ground
- create folders only to imitate another framework

---

## 4. Astro-first decision process

Before creating a component, Cursor must determine:

1. Can an Astro Component implement it?
2. Does it genuinely require Vue?
3. Does shadcn-vue provide a suitable UI Primitive?
4. Does `components/ui` already contain that primitive?
5. Does `components/patterns` contain a reusable Composite Pattern?
6. What is the least aggressive Client Directive?
7. Does the result support RTL, Dark Mode, and Accessibility?
8. Does the project remain suitable for Astro?

Use the earliest adequate option.

---

## 5. Hydration behavior

AI must not add `client:*` automatically.

Preferred order:

1. no directive
2. `client:visible`
3. `client:idle`
4. `client:media`
5. `client:load`
6. `client:only="vue"` only when unavoidable

When adding hydration, the implementation or PR summary must state:

- interaction requiring JavaScript
- selected directive
- why a less aggressive option is insufficient

Do not create multiple hydrated roots that need the same state.

---

## 6. shadcn-vue and Reka UI behavior

When complex interaction is needed:

- prefer an existing UI Primitive or Composite Pattern
- otherwise add only the required shadcn-vue component and review its Reka UI behavior
- configure direction for RTL/LTR
- preserve keyboard and focus behavior
- add browser tests

When adding a shadcn-vue component, Cursor must:

1. verify that it does not already exist
2. use the current repository package manager
3. add only the requested component
4. review every file added by the CLI
5. review new and transitive dependencies
6. integrate existing Design Tokens
7. preserve prior project modifications
8. run existing lint, type-check, Astro check, test, and build scripts
9. list added and modified files in the execution summary

Pages must not import raw Reka primitives. Generated source must be reviewed for naming, tokens, imports, variants, accessibility, RTL, and unused code.

Cursor must not:

- add `client:load` automatically to every Vue component
- convert an entire section to Vue because one nested button or Dialog is interactive
- hand-write Dialog, Dropdown, focus-trap, or keyboard primitives when shadcn-vue/Reka UI fits
- install another UI library without documented approval
- duplicate a UI Primitive in multiple folders
- replace a modified shadcn-vue component without reviewing the diff
- change shared Design Tokens inside one component
- add autoplay without pause behavior and Reduced Motion support
- put translatable text inside a shared UI Primitive

---

## 7. Data and content behavior

AI must prefer:

- local/static content for one-off pages
- Content Collections for repeated structured content
- build-time CMS/API loading
- rebuild webhooks for publication freshness
- live/runtime data only when freshness requires it

AI must not:

- put raw `fetch()` details in pages
- fetch content independently in every card or section
- expose secrets to client code
- use unsanitized `set:html`
- render untrusted SVG
- let raw CMS shapes spread through the UI

External data must have typed contracts and runtime validation where appropriate.

---

## 8. Rendering behavior

AI must treat static rendering as the default.

Before adding an adapter, dynamic route, Action, middleware, or server island, confirm the feature cannot reasonably use:

- a static build
- CMS-triggered rebuild
- an external backend
- a small client island

Do not make the whole project server-rendered for one form or small dynamic block.

If most requested routes require authentication, shared client state, or high interaction, flag that Nuxt may be more appropriate.

---

## 9. Styling behavior

AI must:

- use Tailwind CSS 4 utilities for **all ordinary UI** (complete Tailwind-first policy)
- prefer CVA/`cn` variant maps over Pure/Raw CSS
- consume design tokens
- use semantic color variables
- keep RTL direction-aware
- use parent-owned spacing and `gap`
- include focus, disabled, loading, and error states
- respect reduced motion
- preserve responsive behavior between breakpoints

AI must not:

- hardcode repeated design values
- add `!important`
- create global feature selectors
- write Pure/Raw CSS for layout, spacing, color, or typography utilities already cover
- use component `<style>` except for keyframes/complex animation, rich-text descendants, view transitions, tokens/theme, or approved integration selectors
- use locale branching when logical styles solve it
- add an animation library for ordinary transitions
- hide layout errors with overflow clipping
- construct Tailwind class names dynamically in a way source detection cannot discover
- use broad safelists or eager UI globs to compensate for dynamic imports

---

## 10. i18n and SEO behavior

For every route or shared section, inspect:

- active locales
- visible hardcoded strings
- `lang` and `dir`
- locale-specific route path
- title and description
- canonical
- alternate languages
- Open Graph data
- indexability
- structured data where relevant

Do not add a page in one locale only unless the task and project policy explicitly allow it.

Do not make SEO-critical content client-only.

---

## 11. TypeScript behavior

AI must:

- avoid `any`
- type Astro props
- type Vue props and emits
- use `unknown` and narrowing for untrusted input
- use type-only imports
- keep environment access server/client safe
- create discriminated states where useful
- avoid broad casts that suppress errors

Do not treat successful transpilation as proof of type safety.

---

## 12. Testing behavior

AI must add or update tests when the change affects:

- pure logic
- schemas or mappers
- locale/SEO helpers
- route generation
- browser interaction
- forms
- focus/keyboard behavior
- error states

Use:

- Vitest for logic and contracts
- Playwright for user behavior and accessibility-sensitive interaction

Do not use arbitrary sleeps in browser tests.

---

## 13. Dependency behavior

AI must not add a dependency unless:

- the task materially requires it
- no built-in or approved solution is adequate
- the repository does not already contain a solution
- client/runtime impact is understood

Never modify `package.json` casually to solve a small function.

Do not change package managers or lock files outside the repository's configured tool.

Do not import UI through a large barrel or `import.meta.glob({ eager: true })`. Import the required component directly. Do not put application source under `public`; that directory is copied as static assets.

---

## 14. Change-scope behavior

Prefer the smallest coherent change.

AI must not:

- rewrite unrelated files
- perform repository-wide formatting without request
- rename public APIs casually
- upgrade dependencies during feature work
- delete existing behavior without verification
- create broad abstractions for one current use

A refactor may correct nearby architecture only when it is necessary to implement or safely test the requested change.

---

## 15. Task modes

### Generate

- inspect existing patterns
- place every file correctly
- produce production-ready code
- include required states and tests
- avoid unused alternatives

### Fix

- identify root cause
- make the smallest safe correction
- preserve unrelated behavior
- add regression coverage
- do not hide the issue with delays, broad catches, or client-only rendering

### Refactor

- preserve behavior
- improve responsibility boundaries
- remove weak abstractions
- reduce unnecessary hydration
- avoid new dependencies
- validate output before and after

### Review

Review in this order:

1. Astro suitability and rendering decision
2. architecture and placement
3. JavaScript/hydration cost
4. data/content boundaries
5. i18n, SEO, and accessibility
6. TypeScript
7. styling and responsiveness
8. tests and maintainability

Do not begin with formatting comments while architectural issues remain.

---

## 16. Required response structure for complex coding tasks

Unless the caller requests code only, use:

```md
## Understanding

## Existing Pattern

## Changes

## Validation

## Risks or Exceptions
```

For code-only prompts, output only final required files and their contents.

Do not output unused alternatives or speculative redesigns.

---

## 17. Completion check

Before finishing, confirm:

- [ ] correct framework choice and rendering mode
- [ ] correct folder and naming
- [ ] Astro-first implementation
- [ ] justified hydration only
- [ ] no raw networking in UI
- [ ] typed and validated external data
- [ ] complete locale/RTL behavior
- [ ] correct metadata/indexability
- [ ] accessible semantics and states
- [ ] token-based responsive styling
- [ ] tests and production build validation
- [ ] no unnecessary dependencies or files


---

## 18. Readiness-first execution

Before generating implementation, AI must verify Feature ID, routes, content source, rendering mode, locales, API/CMS contract, and acceptance criteria. If missing, output readiness findings only.

## 19. No fake production implementation

AI must not hide missing APIs, CMS fields, content, or integrations behind fabricated runtime data. It must ask for or document the missing decision.

## 20. Full-scope implementation

When instructed to implement an approved feature, AI must complete every documented part rather than returning a visual scaffold only.

## 21. Dependency proposal

AI may recommend a package, but it must not add or configure it until approval is recorded. The proposal must include built-in alternatives, bundle/runtime impact, maintenance, security, license, ownership, and removal path.
