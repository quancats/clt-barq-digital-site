# Cursor Prompt — Create an Astro Component

Determine whether a new file is justified before implementation.

Input:

- component purpose
- expected reuse
- content contract
- design reference
- owning feature/page

Choose one:

- keep markup in parent
- Astro Component under `components/astro`
- content renderer under `components/astro/content`
- icon/vector under approved folders
- UI Primitive under `components/ui` only when adopting reviewed shadcn-vue source
- Composite Pattern under `components/patterns` when composing primitives
- Vue Island only when browser reactivity is required

Requirements:

- typed props
- semantic HTML
- Design Token-based styling
- RTL/LTR and Dark Mode support where relevant
- accessible states
- no networking
- no hardcoded translatable strings
- tests for meaningful contract

Do not create wrapper-only abstractions. Do not convert a static section to Vue for familiarity.
