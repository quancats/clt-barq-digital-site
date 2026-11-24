# Cursor Prompt — Design and Implement a Vue Island in Astro

Before code, prove why HTML/CSS or a focused script is insufficient.

Define:

- cohesive state boundary
- top-level Vue Island or Composite Pattern
- internal Vue children
- Client Directive and timing
- Server-rendered HTML fallback
- API module if client requests exist
- reviewed shadcn-vue UI Primitive / Reka UI behavior when complex accessible interaction is needed
- RTL, Dark Mode, and focus behavior
- client size and tests

Rules:

- no global Vue app
- no Pinia by default
- no direct raw endpoint logic in UI
- no multiple hydrated roots sharing hidden state
- avoid `client:only`
- use the least aggressive Client Directive
- do not install Nuxt UI or React for the interaction
- do not rebuild Dialog, Dropdown, or focus-trap behavior when shadcn-vue/Reka UI fits
- add only the required shadcn-vue component, review generated files, and preserve prior project modifications
