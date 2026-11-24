# Astro Styling and Design System Standard

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

# Styling and Design System Standard

## Purpose

This document defines Tailwind CSS 4 usage, design tokens, global CSS boundaries, component styling, responsive behavior, RTL/LTR support, themes, typography, motion, and media presentation.

---

## 1. Styling architecture

The standard layers are:

```text
Design tokens
  -> semantic theme variables
  -> Tailwind utilities
  -> Astro/Vue component variants
  -> page composition
```

Do not allow pages to invent colors, spacing scales, shadows, or typography systems independently.

---

## 2. CSS files

Recommended:

```text
src/styles/
├── global.css
├── tokens.css
├── theme.css
└── typography.css
```

### `global.css`

Owns:

- Tailwind import
- other global stylesheet imports
- box-sizing/base element rules
- body defaults
- focus and accessibility helpers
- global media behavior

### `tokens.css`

Owns:

- Tailwind `@theme` variables
- brand scales
- typography scales
- spacing and radius additions
- shadows and breakpoints approved by design

### `theme.css`

Owns semantic mappings for:

- surface
- foreground
- muted
- border
- brand
- success/warning/error
- dark or alternate theme

### `typography.css`

Owns:

- self-hosted font faces
- content/prose styles
- language-specific typography adjustments
- long-form element rhythm

Do not split global CSS into many files without a clear ownership boundary.

---

## 3. Tailwind CSS 4

Use the Vite plugin and CSS-first theme configuration.

Example:

```css
@import "tailwindcss";

@theme inline {
  /* Families registered via Astro Fonts (`astro.config` + <Font />); map per locale */
  --font-sans: var(--font-document, var(--font-tajawal));

  --color-brand-50: oklch(0.98 0.02 240);
  --color-brand-500: oklch(0.62 0.16 240);
  --color-brand-900: oklch(0.28 0.08 240);

  --radius-control: 0.75rem;
  --radius-card: 1rem;
}

html[lang='ar'] {
  --font-document: var(--font-tajawal);
}

html[lang='en'] {
  --font-document: var(--font-manrope);
}
```

Rules:

- use theme variables for values that should create utilities
- use ordinary CSS custom properties for semantic/runtime values that should not create utility namespaces
- avoid restoring a large JavaScript Tailwind config by habit
- do not rely on unsupported legacy configuration patterns
- use full, statically discoverable class names

Do not generate class fragments:

```ts
`bg-${color}-500`
```

Use a static map of semantic classes:

```ts
const variants = {
  primary: 'bg-primary text-primary-foreground',
  danger: 'bg-destructive text-destructive-foreground',
} as const
```

### Source detection

- a source file under `src` does not enter the JavaScript bundle merely because it exists
- do not use `import.meta.glob` with `eager: true` to import all UI Primitives
- review how temporarily unused UI Primitive files affect Tailwind CSS source detection
- do not exclude all of `components/ui` from scanning
- use `@source` or `@source not` only for a documented reason
- do not add a broad safelist instead of using discoverable classes

---

## 4. Token model

Use two levels:

### Foundation tokens

Raw design choices:

- brand scales
- neutral scales
- font families
- size scale
- radius scale
- shadows

### Semantic tokens

Meaning in the UI:

```css
:root {
  --surface-page: var(--color-neutral-50);
  --surface-card: white;
  --text-primary: var(--color-neutral-950);
  --text-muted: var(--color-neutral-600);
  --border-default: var(--color-neutral-200);
  --action-primary: var(--color-brand-600);
}
```

Components consume semantic meaning whenever a theme may remap values.

Do not name a reusable token after a single page or temporary design.

shadcn-vue variables must map to the project's semantic Design Tokens, including surface/background, foreground, primary, muted, accent, destructive, border, input, ring, and radius. Generated defaults do not override an established Design System.

---

## 5. Component styling

### Tailwind-complete first

Write **all ordinary UI styling with Tailwind CSS utilities** (and CVA/`cn` variant maps). Prefer utilities over Pure/Raw CSS by default.

Allowed non-utility CSS is **narrow and intentional**:

| Allowed raw/scoped CSS | Why |
| ---------------------- | --- |
| Design tokens / theme variables (`tokens.css`, `theme.css`, `@theme`) | System values Tailwind consumes |
| Cross-document View Transitions (`view-transitions.css`) | Browser APIs utilities cannot express |
| Keyframe animations / complex motion | When Tailwind `animate-*` or `tw-animate-css` cannot express the motion clearly |
| Rich-text / MDX descendant selectors (`typography.css` `.prose :where(...)`) | Generated markup without class hooks |
| Third-party / integration selector APIs | Required by an approved dependency |
| Substantial pseudo-elements with no clean utility equivalent | Rare; prefer utilities when possible |

### Forbidden / avoid by default

- Component or page Pure/Raw CSS that only restates spacing, color, typography, layout, border, or flex/grid utilities
- New global feature CSS files for one-off pages
- Large `<style>` blocks that duplicate Tailwind
- Restoring a habit of hand-written CSS modules for ordinary Astro/Vue UI

### Component-scoped `<style>`

Use `<style>` only when an allowed exception above applies. Prefer:

1. Tailwind utilities on the element
2. Shared CVA variants in `astroVariants.ts` / `cn()`
3. Scoped CSS for animation/keyframe or generated-content selectors only

When scoped CSS is required for animation, keep it next to the component and honor `prefers-reduced-motion`.

### Global CSS

Limit global CSS to reset/base, tokens, theme, typography for generated content, view transitions, and unavoidable cross-cutting base rules. Do not place feature-specific selectors globally.

### `@apply`

Avoid using `@apply` to recreate long component classes in CSS. Prefer component markup and variants. Use `@apply` sparingly for unavoidable third-party or generated markup selectors or thin base-layer bridges.

---

## 6. Variants

Use small controlled variant maps inside the component.

Example:

```ts
const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border border-default bg-surface-card text-primary',
  ghost: 'bg-transparent text-primary hover:bg-surface-muted',
} as const;
```

Rules:

- avoid dynamic class fragments that Tailwind cannot detect
- avoid variant explosion
- prefer meaningful semantic variants
- keep state styles near the component
- do not expose every token as a prop

A class-composition utility may be approved if the project has enough variants to justify it. Do not add one for two simple components.

When shadcn-vue is adopted, use the project's single `cn()` utility for merging conditional classes. Do not create competing merge helpers.

---

## 7. Class readability

Use a consistent order:

1. layout and display
2. position and z-index
3. dimensions
4. spacing
5. typography
6. color/background/border
7. effects
8. interaction states
9. responsive/direction/theme variants

Use the project's Prettier/Tailwind sorting setup if approved.

Long class sets are not automatically a reason for extraction. Extract when a meaningful component or variant exists.

---

## 8. Spacing ownership

- parent layout owns relationships between siblings
- use `gap` for repeated spacing
- section components own their internal rhythm
- page shells own route-wide vertical structure
- avoid arbitrary child margins that leak into different contexts
- avoid negative margins unless the design requires and documents them

A component should not assume the exact external spacing of every location where it is used.

---

## 9. Responsive design

Design mobile-first unless project evidence requires another priority.

Rules:

- use content-driven breakpoints rather than device names
- do not create a breakpoint for every design frame
- avoid hiding essential content on small screens
- test intermediate widths, not only standard presets
- maintain readable line lengths
- keep touch targets usable
- prevent horizontal overflow
- ensure navigation remains operable with zoom and large text

Use container queries only when component-level responsiveness clearly benefits and browser support matches project policy.

---

## 10. RTL and logical styling

Prefer logical properties and direction-aware utilities:

- inline start/end rather than left/right
- block start/end where useful
- text alignment based on direction
- direction-aware icon treatment

Avoid:

- duplicated Arabic and English components
- scattered `locale === 'ar'` class branches
- manually reversing every flex row without understanding content order
- flipping icons that represent universal direction incorrectly

Review icons individually:

- arrows meaning previous/next often follow direction
- external-link icons generally do not flip
- media playback icons generally do not flip
- brand marks do not flip

Test Reka-backed controls under an RTL provider.

---

## 11. Theme and color mode

A project may be:

- single-theme
- system light/dark
- user-selectable light/dark
- multi-brand

The strategy must be defined before component implementation.

For color mode:

- set the theme attribute/class before first paint when possible
- avoid a flash of incorrect theme
- store only a non-sensitive preference
- support system preference when required
- use semantic tokens rather than duplicating entire class sets
- verify images, logos, and third-party embeds in every theme
- use one theme-state source; do not create independent theme logic inside every Vue Island
- test Dialog, Dropdown, Forms, and Carousel in Light and Dark

Do not install a Vue state library for a theme switch. A small initialization script and DOM attribute are normally sufficient.

---

## 12. Typography

- prefer the Astro Fonts API for self-hosted provider fonts (no Google Fonts CSS CDN `@import`)
- for bilingual `ar`/`en` baselines, register **Tajawal** and **Manrope** via `fontProviders.google()` (or an approved equivalent) unless a project ADR chooses another licensed pair
- CSS variables: `--font-tajawal` for Arabic, `--font-manrope` for English; bind `--font-document` / `--font-sans` from `html[lang]`
- selectively preload **only** the active locale family in the document head (`ar` = Tajawal, `en` = Manrope) with weight `400` + locale subset — do not boolean-preload all registered variants
- treat fonts as locally served build assets; do not hard-code `/_astro/fonts` as a guaranteed public path
- limit registered weights/styles to those used (commonly 400 / 500 / 700)
- define robust Arabic and Latin fallback stacks
- use semantic heading levels independent of visual size
- keep body line length readable
- use consistent leading and paragraph rhythm
- do not use tiny text to fit designs
- account for Arabic glyph height and diacritics
- test mixed Arabic/English strings, numbers, URLs, and acronyms

Long-form content should use a controlled prose layer rather than page-specific descendant styles.

---

## 13. Focus, hover, and states

Every interactive component needs appropriate:

- default
- hover where relevant
- active/pressed
- focus-visible
- disabled
- loading
- error/invalid
- selected/current

Do not remove outlines without an accessible replacement.

Hover must not be the only way to reveal essential information.

Disabled controls must communicate both visual and semantic state.

---

## 14. Motion

Use motion to explain hierarchy or state, not as decoration by default.

Rules:

- prefer CSS transitions
- animate transform and opacity where practical
- avoid layout-heavy animation
- respect `prefers-reduced-motion`
- do not delay access to content
- avoid autoplay motion that distracts or causes discomfort
- ensure exit/overlay animations do not trap focus

A CSS-only Marquee must stop or substantially reduce movement under `prefers-reduced-motion`. Do not use JavaScript only to maintain continuous visual movement.

Animation libraries require approval under `INTEGRATIONS.md`.

---

## 15. Images and media styling

- reserve aspect ratio and dimensions
- use `object-fit` deliberately
- define focal points for CMS images when needed
- do not crop informative content unexpectedly
- use captions when required
- preserve contrast for text overlays
- avoid placing important text inside images
- use responsive sources rather than CSS-resizing huge images

The hero LCP image must receive explicit loading and fetch-priority review.

---

## 16. Arbitrary values

Arbitrary values are allowed for true one-off design facts, but repeated values must become tokens.

Acceptable:

```text
max-w-[68ch]
```

Potentially weak:

```text
mt-[37px] text-[19px] rounded-[13px]
```

If a value appears repeatedly or represents a system decision, promote it to a token.

---

## 17. Prohibited patterns

- `!important` without documented third-party override need
- inline style strings for normal design values
- hardcoded colors scattered across components
- page-specific global selectors
- giant CSS files duplicating Tailwind utilities
- Pure/Raw CSS for ordinary layout, spacing, color, or typography that Tailwind utilities already cover
- locale-specific template duplication
- arbitrary z-index escalation
- hiding overflow to conceal layout bugs
- inaccessible contrast accepted because it matches a mockup
- using JavaScript to solve responsive layout CSS can handle

---

## 18. Review checklist

- [ ] Ordinary UI uses Tailwind utilities; scoped/raw CSS is limited to tokens, theme, view transitions, keyframes, or generated-content selectors.
- [ ] Tokens are used for system values.
- [ ] Semantic variables support theme changes.
- [ ] Tailwind classes are readable and detectable.
- [ ] Spacing ownership is clear.
- [ ] RTL uses logical/direction-aware behavior.
- [ ] Responsive behavior works between breakpoints.
- [ ] Focus and state styles exist.
- [ ] Motion respects reduced-motion settings.
- [ ] Typography works for Arabic and English.
- [ ] Media dimensions and crops are stable.
- [ ] No unnecessary global CSS or `!important` exists.
- [ ] UI Primitive styling and Composite Pattern styling have separate ownership.
- [ ] Tailwind source detection does not rely on dynamic fragments or broad safelists.


---

## 19. Design fidelity and system quality

The design is implemented accurately using approved tokens and components. When a mockup conflicts with accessibility, content resilience, responsive behavior, or established design-system contracts, document the issue and propose the smallest compliant adjustment rather than silently copying the defect.

## 20. Informational-site interaction policy

Do not add animation or client state to make a static section appear more sophisticated. Interaction must serve navigation, comprehension, feedback, or conversion and must respect reduced motion.

## 21. Primitive and pattern styling boundary

A UI Primitive owns reusable states, variants, focus behavior, and semantic token consumption. A Composite Pattern owns composition, project-specific spacing, content arrangement, and local layout. Do not modify a shared UI Primitive to solve a one-page layout exception, and do not duplicate primitive state styles inside patterns.
