# Cursor Rule — Astro Components and Islands

## Component layers

- Astro Component (`components/astro`): layout, sections, content, SEO, and CSS-only motion with no Client State
- UI Primitive (`components/ui`): reviewed project-owned `shadcn-vue` source, normally built on Reka UI
- Vue Island (`components/islands`): hydrated boundary that owns cohesive browser state and events
- Composite Pattern (`components/patterns`): reusable composition of UI Primitives and project behavior

## Icon rule

Use `astro-icon` with locally installed Iconify data as the default:

- `@iconify-json/lucide` for interface actions, navigation, status, and decorative UI
- `@iconify-json/simple-icons` only for company, product, service, and platform logos
- `Icon` from `astro-icon/components`; render SVG through Astro without client runtime fetching

Do not use an Iconify CDN/runtime API, icon font, additional icon family, or Simple Icons for general UI. Decorative icons must be hidden from assistive technology; meaningful standalone icons need an accessible name. Keep bespoke trusted SVGs under `src/assets/icons` (`astro-icon` `iconDir`) only when the approved collections do not provide the required artwork or controlled markup. Keep larger illustrations under `components/vectors` or approved asset folders.

## Creation rule

Before creating a component:

1. Can an Astro Component implement it?
2. Does it genuinely require Vue?
3. Does shadcn-vue already provide a suitable UI Primitive?
4. Does `components/ui` or `components/patterns` already solve it?
5. What is the least aggressive Client Directive?

Create a file only for meaning, isolated behavior, reuse, complexity, accessibility, or testability. Do not create class-only wrappers, slot-only shells, or files based on DOM depth.

## Island rule

Before Vue, consider semantic HTML, CSS, native elements, and a focused browser script. Define a Vue Island by shared state and behavior, not by visible element count. Select the least aggressive Client Directive. Do not add `client:load` automatically to every Vue component. Avoid `client:only` unless a Browser API makes SSR impossible.

## shadcn-vue and Reka rule

`shadcn-vue` is the approved primary UI Primitive source for new Astro projects. Reka UI is the behavior layer under those primitives. Pages and Astro Components must not import raw Reka primitives. Review generated files, dependencies, Design Tokens, RTL, accessibility, and prior project modifications before adoption. Nuxt UI is not approved as a permanent Astro dependency.

## Required quality

Typed props/emits, Server-rendered HTML when possible, fallback before Hydration, RTL, Dark Mode, focus/keyboard behavior, client-size awareness, and browser tests.
