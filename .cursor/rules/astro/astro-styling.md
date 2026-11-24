# Cursor Rule — Astro Styling

## Baseline

Use Tailwind CSS 4 through `@tailwindcss/vite`, CSS-first theme tokens, semantic variables, and mobile-first responsive composition. Map shadcn-vue variables to the project's semantic Design Tokens.

## Tailwind-complete policy

Write **all ordinary UI with Tailwind utilities** (plus CVA/`cn` variant maps). Avoid Pure/Raw CSS and component `<style>` blocks except when Tailwind cannot express the need cleanly.

Allowed raw/scoped CSS only for:

- design tokens / theme variables (`tokens.css`, `theme.css`, `@theme`)
- view transitions (`view-transitions.css`)
- keyframe / complex animation (honor `prefers-reduced-motion`)
- rich-text / MDX descendant selectors (`.prose :where(...)`)
- approved third-party selector APIs
- rare substantial pseudo-elements with no utility equivalent

Do not hand-write CSS for spacing, color, typography, layout, borders, or flex/grid that utilities already cover.

## Rules

- use Design Tokens for repeated/system values
- use CSS Logical Properties and direction-aware utilities
- parent layouts own sibling spacing
- use `gap` over scattered margins
- use full, statically discoverable class names and static variant maps
- use the project's single `cn()` utility when adopted
- provide focus, hover, active, disabled, loading, selected, and error states
- support reduced motion
- keep one theme-state source; prevent flash of incorrect theme
- test Light/Dark and Arabic/Latin typography
- prefer Astro Fonts: Tajawal for `ar`, Manrope for `en`; bind via `html[lang]` and preload only the active locale
- keep UI Primitive styling separate from Composite Pattern layout styling
- preserve image dimensions and LCP strategy

## Forbidden

- dynamic class fragments such as `` `bg-${color}-500` ``
- broad safelists or eager UI globs used only to make classes appear
- `!important` without approved third-party exception
- scattered hardcoded colors/system values
- Pure/Raw CSS that only duplicates Tailwind utilities
- Google Fonts CSS CDN `@import` when Astro Fonts can self-host
- preloading every locale font family on every page
- locale-specific duplicated templates
- JavaScript for layout CSS can solve
- global feature selectors
- animation libraries without dependency approval
- changing shared Design Tokens inside one component

Implement the design faithfully, but report accessibility or resilience conflicts before copying a defective pattern.
