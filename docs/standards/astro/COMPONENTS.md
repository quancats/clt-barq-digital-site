# Astro Components and Islands Standard

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

# Components and Islands Standard

## Purpose

This document defines how components are selected, created, named, composed, hydrated, and reviewed in Astro projects.

The official UI stack for new Astro projects is:

```text
Astro
+ Tailwind CSS 4
+ Vue 3 Islands
+ shadcn-vue
+ Reka UI
+ Embla Carousel
+ Zod
+ vee-validate when needed
```

> Astro is the site's primary framework. Vue is a limited interaction layer used through Islands, not the framework for the whole page.

Nuxt UI is not a permanent Astro dependency. It is allowed only as a documented migration exception in an existing project. New Astro projects use reviewed, project-owned `shadcn-vue` source code for interactive UI.

---

## 1. Component taxonomy

Use these terms consistently:

| Layer | Location | Default format | Responsibility |
|---|---|---|---|
| Core chrome | `components/core` | `.astro` | BaseHead, StructuredData, Analytics, CookieConsent, FormField |
| Layout chrome | `components/layout` | `.astro` | Header, Footer, Container without Client State |
| Astro Component | `components/astro` | `.astro` | Static sections, content, and motion without Client State |
| UI Primitive | `components/ui` | `.vue` | Reviewed `shadcn-vue` source code and project-owned primitive behavior |
| Vue Island | `components/islands` | `.vue` | A hydrated boundary that owns cohesive browser state and events |
| Composite Pattern | `components/patterns` | `.vue` | A reusable business/UI composition made from multiple UI Primitives |

Do not classify by visual size. Classify by responsibility and runtime behavior.

---

## 2. Decision tree

```text
Does the component need browser interaction?
│
├── No
│   └── Use an Astro Component
│
└── Yes
    │
    ├── Can semantic HTML/CSS provide the behavior?
    │   ├── Yes → Use Astro + HTML/CSS
    │   └── No
    │
    └── Use a Vue Island
        │
        ├── Does a shadcn-vue UI Primitive exist?
        │   ├── Yes → Use or customize the reviewed project copy
        │   └── No → Review Reka UI, then create a focused custom component
        │
        └── Choose the least aggressive client:* Client Directive
```

Before creating a file, also inspect `components/ui` and `components/patterns`. Do not extract markup that has no meaningful responsibility.

---

## 3. Astro Components

Astro Components are required by default for:

- headings and text blocks
- buttons rendered as links or native buttons
- cards and badges
- containers and sections
- pages, layouts, and static navigation
- header/footer structure
- hero, feature, service, static testimonial, CTA, and FAQ markup
- breadcrumbs
- article metadata
- CMS content renderers
- static forms posted to a server endpoint
- SEO metadata and structured data
- static card grids and CSS-only marquees

### Props

Define an explicit interface:

```astro
---
interface Props {
  title: string;
  description?: string;
  href?: string;
  headingLevel?: 2 | 3 | 4;
}

const {
  title,
  description,
  href,
  headingLevel = 2,
} = Astro.props;
---
```

Rules:

- avoid untyped `Astro.props`
- provide defaults in destructuring
- use unions for controlled variants
- avoid exposing raw class strings as the only customization API
- use `class:list` for conditional classes
- forward attributes only when the component contract supports them

### Slots

Use named slots when they express a stable composition contract:

```astro
<slot name="eyebrow" />
<slot />
<slot name="actions" />
```

Do not create a component only to wrap one anonymous slot with classes.

### Polymorphism

Use polymorphic tags carefully. A component that can render `a`, `button`, or `div` must preserve semantic and accessibility requirements for each mode. Prefer separate clear APIs over unrestricted `as` values.

---

## 4. UI Primitives

A UI Primitive in `components/ui`:

- has no business or route meaning
- uses design tokens
- supports RTL/LTR without content branching
- exposes a small predictable API
- has accessible defaults
- can be tested independently
- is normally reviewed source added by `shadcn-vue` and built on Reka UI
- is owned and customizable by the project

Do not rewrite a complex accessible primitive when shadcn-vue/Reka UI provides the required behavior. Review generated files and dependencies before adoption. Do not overwrite a previously customized UI Primitive without reviewing the diff. Static Astro primitives such as a card surface or container belong in `components/astro`, not in this Vue primitive layer.

### Weak examples

- `UIWrapper`
- `UIBox`
- `UIInner`
- a component that only adds `flex gap-4`
- a wrapper whose props are mostly arbitrary classes

### Wrapper acceptance test

A wrapper is accepted only if it provides at least one:

- stable variant API
- shared accessibility behavior
- enforced spacing or typography contract
- repeated cross-project behavior
- meaningful reduction of inconsistent implementation

---

## 5. Composite Patterns

A Composite Pattern in `components/patterns` may know:

- a page or route family
- a CMS view model
- project-specific section meaning
- brand-specific composition
- a project's navigation or footer model

Examples include `SiteHeader.vue`, `ContactForm.vue`, `TestimonialsCarousel.vue`, and `FAQAccordion.vue`. A Composite Pattern composes UI Primitives and project behavior. It is not itself a low-level UI Primitive. Static project sections remain Astro Components under `components/astro/sections`.

### Page-specific versus shared

Keep a section close to its page until one of these becomes true:

- it is used by more than one route
- it has isolated complexity
- it has a clear content contract
- testing it independently is valuable
- it is part of an approved section taxonomy

Avoid extracting every visual section before its responsibility is understood.

---

## 6. Vue Islands

Use Vue when browser-side reactivity is genuinely required.

Appropriate examples:

- mobile navigation with focus management
- navigation menus and dropdown menus
- dialogs, sheets, drawers, popovers, and command menus
- command/search interfaces
- multi-step or conditional forms
- complex combobox/select interactions
- user-controlled filters that update results without navigation
- interactive carousels where native scrolling is insufficient
- widgets with shared local state

Inappropriate examples:

- static cards
- headings
- pricing tables without interaction
- basic FAQ that can use native `<details>`
- a theme icon when a small script is sufficient
- a link styled as a button

### Island boundary

An island must be cohesive. If search input, filters, results, and pagination share state, place them under one top-level island rather than four hydrated roots.

Define a Vue Island by shared state and behavior, not by the number of visible controls. Prefer one `SiteHeader` Island containing Navigation Menu, Dropdown Menu, Mobile Drawer, language switcher, theme switcher, and Search Dialog when they share state. Do not hydrate each child as a separate root.

### Vue implementation rules

- use `<script setup lang="ts">`
- type props and emits
- keep networking in `lib/api`
- keep browser state local unless a real shared-state requirement exists
- avoid Pinia by default
- use `@vueuse/core` only for a stable helper that reduces custom browser code
- do not assume a global Vue application root
- do not depend on another separately hydrated island's state

---

## 7. Hydration policy

### No directive

Use when a framework component should output Server-rendered HTML and needs no browser behavior. Prefer an Astro Component for new static components. A Vue component does not automatically require Hydration.

### `client:visible`

Default for below-the-fold interaction.

Examples:

- FAQ Accordion
- Testimonials Carousel
- Contact Form
- interactive gallery
- embedded calculator
- optional interactive map

### `client:idle`

Use for non-critical interaction likely needed after initial load.

Examples:

- secondary dialog triggers or actions
- secondary newsletter widget
- non-critical feedback control

### `client:media`

Use only when behavior exists under a responsive condition and avoiding delivery elsewhere has real value, for example `<DesktopMegaMenu client:media="(min-width: 1024px)" />`.

### `client:load`

Reserve for interaction required immediately after the page loads.

Examples:

- cohesive interactive Site Header or primary mobile menu
- immediately usable accessibility-critical control

### `client:only="vue"`

Treat as an exception. It is allowed only for a component that depends entirely on a Browser API and cannot render on the server. Add a code comment and explicit PR explanation.

### Review questions

Every hydrated component must answer:

- what fails without JavaScript?
- why this directive?
- how large is the client code?
- can the interaction be native HTML/CSS?
- is the component below the fold?
- is focus behavior tested?

Do not add `client:*` automatically to every Vue component. Justify `client:load` and `client:only` in review. Do not split one cohesive interaction into multiple small Islands without a measurable benefit.

---

## 8. shadcn-vue and Reka UI policy

`shadcn-vue` is the approved primary component source for new Astro projects. Its components are copied into project source, become project-owned UI Primitives, and may be adapted to the Design System. Reka UI is the approved low-level behavior layer under those primitives.

Use it for components such as:

- dialog and alert dialog
- dropdown menu
- popover and tooltip
- select and combobox
- tabs when keyboard behavior is non-trivial
- accordion when native `<details>` is insufficient
- command-style interfaces

Pages and Astro Components must not import raw Reka primitives. They consume a Vue Island or Composite Pattern; those compose reviewed UI Primitives.

Required flow:

```text
Reka primitive
  -> reviewed shadcn-vue UI Primitive
  -> Composite Pattern or top-level Vue Island
  -> Astro page or section
```

This provides:

- stable project API
- design-token integration
- consistent RTL configuration
- centralized accessibility defaults
- easier future replacement

### RTL

A Reka-backed island supporting both directions must receive or derive `dir` and use the approved provider strategy. Do not assume LTR defaults.

Generated components must be reviewed, tokenized, RTL-tested, and aligned with existing project conventions. Add only the requested component. Never replace a modified project copy without reviewing differences. Nuxt UI is not approved for new Astro projects.

## 9. Nuxt UI replacement map

| Nuxt UI | Astro replacement |
|---|---|
| `UButton` | shadcn-vue Button |
| `UNavigationMenu` | Navigation Menu |
| `UDropdownMenu` | Dropdown Menu |
| `UModal` | Dialog |
| `USlideover` | Sheet or Drawer |
| `UInput` | Input |
| `UTextarea` | Textarea |
| `UCheckbox` | Checkbox |
| `URadioGroup` | Radio Group |
| `USelect` | Select |
| `USelectMenu` | Select or Combobox |
| `UForm` | Native Form or Vue Form Island |
| `UFormField` | Field + Label + Validation Message |
| `UAccordion` | Accordion |
| `UCarousel` | shadcn-vue Carousel + Embla |
| `UTabs` | Tabs |
| `UPopover` | Popover |
| `UTooltip` | Tooltip |
| `UCommandPalette` | Command |
| `UNotifications` | Sonner |
| `UBreadcrumb` | Astro Component by default |
| `UPagination` | Astro Component or Vue Island according to behavior |
| `UTable` | HTML/Astro by default; Vue only for interactive sorting/filtering |
| `UIcon` | `astro-icon` with Lucide by default; Simple Icons only for company and platform logos |

> A Vue replacement does not make Vue mandatory. If semantic HTML, Astro, and CSS can provide the component, that is the first choice.

---

## 10. Interaction standards

### Navigation and dropdowns

Static navigation uses Astro and semantic links. Interactive navigation is one Vue Island and uses Navigation Menu or Dropdown Menu; mobile navigation uses Sheet or Drawer. Test keyboard navigation, focus management, Escape, outside click, active route, RTL, reduced motion, and accessible labels. Do not hand-build a dropdown from positioned `div` elements when shadcn-vue/Reka UI supplies the behavior.

### Dialog and overlays

- Dialog: content or action in an overlay.
- Alert Dialog: a sensitive decision requiring confirmation.
- Sheet: a side panel.
- Drawer: a mobile- or gesture-oriented panel.
- Popover: small contextual content, not a full window.

Do not use an overlay for content that belongs naturally on the page. Provide a semantic title, automatic focus management and restoration, Escape where appropriate, and background scroll locking when needed. Avoid a giant general-purpose modal with unrelated props.

### Forms

Use native HTML Form and Astro for simple server submissions. Use a Vue Island for conditional fields, multi-step flows, immediate validation, dependent selects, file previews, dynamic arrays, autosave, rich feedback, or complex submission state. The approved interactive stack is Zod, optional vee-validate, and shadcn-vue Form UI Primitives.

Server Validation is mandatory. Shared form schemas live in `src/lib/validation`; translated errors must associate Label, Description, and Error with each input. Expose loading, success, and error states, prevent duplicate submission, and never send secrets to Client Code.

### Accordion

Use native `<details>/<summary>` for simple disclosure. Use shadcn-vue Accordion when controlled state, advanced shared behavior, programmatic opening, URL integration, or non-trivial animation is required. A below-the-fold FAQ normally uses `<FAQAccordion items={faqItems} client:visible />`, while keeping its content in Server-rendered HTML whenever possible.

### Carousel

Use shadcn-vue Carousel with Embla only when a grid is not clearer. Provide explicit previous/next controls and keyboard support. Do not enable autoplay by default. If approved, provide pause behavior, consider hover/focus pause, respect `prefers-reduced-motion`, and never make essential content available only through automatic movement. Use `client:visible` below the fold and `client:load` only for an immediately interactive primary carousel. Keep payloads small and optimize images with Astro.

### Marquee

Use an Astro Component plus CSS animation by default: semantic markup, duplicated track only when necessary, no Client Directive, and reduced/stopped motion under `prefers-reduced-motion`. Use Vue + Embla Auto Scroll only for drag, interaction pause, runtime speed/direction, programmatic control, or user-linked continuous scrolling; normally hydrate it with `client:visible`.

## 11. Required examples

```astro
---
import SiteHeader from '@/components/patterns/SiteHeader.vue'
---

<SiteHeader client:load />
```

```astro
---
import FAQAccordion from '@/components/patterns/FAQAccordion.vue'
---

<FAQAccordion items={faqItems} client:visible />
```

```astro
---
import FeatureCard from '@/components/astro/content/FeatureCard.astro'
---

<section>
  {features.map((feature) => <FeatureCard {...feature} />)}
</section>
```

```astro
---
import ContactForm from '@/components/patterns/ContactForm.vue'
---

<ContactForm client:visible />
```

```astro
---
import Marquee from '@/components/astro/motion/Marquee.astro'
---

<Marquee items={partners} />
```

## 12. Native HTML before custom interaction

Prefer:

- `<details>/<summary>` for simple disclosure
- `<dialog>` when browser support and behavior requirements are met
- standard links for navigation
- native buttons for actions
- scroll snapping for simple horizontal content
- CSS transitions for visual feedback
- server-posted forms for simple submissions

Do not replace native semantics with clickable `div` elements.

---

## 13. Component API standards

### Variants

Use small controlled unions:

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
```

Avoid dozens of booleans that create incompatible combinations.

### Events

- use native events where possible
- name Vue emits by user intent
- do not emit implementation details
- document asynchronous behavior and disabled states

### Content

Prefer slots for rich composition and props for structured values. Do not pass large HTML strings.

### Classes

A `class` passthrough may be supported for layout integration, but the component must still own its visual contract. Do not expose internal selectors as public API.

### IDs

Generate stable IDs for labels and descriptions. Do not use random IDs during server rendering.

---

## 14. Accessibility requirements

Every component must consider:

- semantic role and element
- keyboard behavior
- focus visibility
- focus entry and restoration for overlays
- label and description associations
- disabled versus `aria-disabled` behavior
- status/error announcements
- motion reduction
- RTL keyboard expectations where relevant
- focus trapping and restoration where needed
- color contrast and visible focus
- touch target size
- disabled and loading states

Complex controls require browser tests, not only visual inspection.
Do not rebuild an accessible primitive manually when shadcn-vue/Reka UI provides the required behavior.

---

## 15. Component testing

Test the highest-value contract:

- pure variants and class generation with unit tests
- schemas/mappers separately from components
- rendered semantic output for meaningful Astro components
- browser behavior for hydrated islands
- keyboard and focus behavior for Reka-backed components
- both `dir="rtl"` and `dir="ltr"` for direction-sensitive controls

Do not write snapshots that merely record large unstable HTML trees without asserting behavior.

---

## 16. Imports, unused components, and anti-patterns

Reject:

- converting the entire site to Vue components
- hydrating all Vue components with `client:load`
- several islands coordinating through global browser events
- direct Reka imports across pages
- generated shadcn-vue components copied without review
- global Pinia for a marketing website
- wrapper-only component proliferation
- arbitrary `as` polymorphism that breaks semantics
- client-only rendering for indexable content
- fetching CMS content inside cards or sections
- rendering untrusted HTML or SVG
- one large barrel that imports the whole UI library
- `import.meta.glob` with `eager: true` for all UI components
- application source placed in `public`; everything in `public` is copied as a static asset

Import the required component directly. Remove unused experimental components before merge when no adoption plan exists. Unused Design System UI Primitives may remain temporarily after reviewing their CSS source-detection impact.

---

## 17. Review checklist

Before approving a component:

- [ ] The file exists for a meaningful reason.
- [ ] The component is correctly classified as Astro Component, UI Primitive, Vue Island, or Composite Pattern.
- [ ] `.astro` was preferred unless browser reactivity is required.
- [ ] The island is cohesive.
- [ ] Hydration is absent or uses the least aggressive directive.
- [ ] shadcn-vue/Reka UI is used for suitable complex primitives.
- [ ] Props, emits, and states are typed.
- [ ] Semantic and keyboard behavior are correct.
- [ ] RTL and responsive behavior are verified.
- [ ] No raw networking or untrusted HTML exists in the component.
- [ ] Tests cover the component's important contract.


---

## 18. Complete design implementation

Implement approved designs faithfully, but do not reproduce inaccessible or technically harmful behavior without review. When an internal component or native pattern offers a safer accessible solution, document the proposed variance before changing the design.

## 19. CMS component contracts

CMS-driven sections must consume normalized view models rather than raw CMS blocks. Unknown block types must fail clearly or render an approved safe fallback; they must not silently output arbitrary HTML.

## 20. Placeholder policy

Do not add fake cards, testimonials, team members, or statistics to production routes merely to complete a layout. Use approved content fixtures only in tests, Storybook-like review environments if adopted, or tasks that explicitly request placeholders.
