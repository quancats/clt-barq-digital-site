# Astro Pull Request Review Standard

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

# Pull Request Review Checklist — Astro Frontend

## How to use

Review architecture before style.

Classify findings as:

- **Critical:** security, data exposure, broken rendering, accessibility blocker, SEO/indexing damage, architectural incompatibility
- **Important:** maintainability, performance, responsibility, incomplete states, weak typing, inconsistent project standard
- **Optional:** refinement that does not block correctness or maintainability

Do not approve a PR with unresolved critical items.

---

## 1. Scope and project fit

- [ ] The PR has one coherent purpose.
- [ ] Unrelated refactors or dependency upgrades are excluded.
- [ ] Astro remains appropriate for the affected feature.
- [ ] The change does not turn a content site into a client application accidentally.
- [ ] Architectural exceptions are documented.

---

## 2. Astro and Rendering

- [ ] The component uses an Astro Component unless it needs Client State.
- [ ] Vue usage has a clear reason.
- [ ] The least aggressive Client Directive is selected.
- [ ] No multiple small Vue Islands share the same state.
- [ ] `client:load` is justified.
- [ ] No unjustified `client:only` exists.
- [ ] No unnecessary eager `import.meta.glob` exists.
- [ ] Core content and actions remain useful if optional JavaScript fails.
- [ ] Browser APIs are not accessed during server rendering.
- [ ] Server output is deterministic.

---

## 3. UI Components and structure

- [ ] Pages remain route-level orchestrators and layouts contain only page-shell concerns.
- [ ] Static components are under `components/astro`.
- [ ] `components/ui` was checked before creating a UI Primitive.
- [ ] shadcn-vue/Reka UI is used for suitable complex primitives.
- [ ] No accessible primitive was rebuilt manually without reason.
- [ ] A Composite Pattern is under `patterns` and a hydrated state boundary under `islands`, not `ui`.
- [ ] Existing modified shadcn-vue source was not overwritten without a diff review.
- [ ] API/CMS access, mapping, and validation use the correct `lib` boundary.
- [ ] Direct imports are used; no oversized UI barrel loads unnecessary components.
- [ ] Application source is not placed in `public`.

---

## 4. Forms

- [ ] Server Validation exists.
- [ ] Client Validation is not the only source of truth.
- [ ] Labels, descriptions, and errors are associated with fields.
- [ ] Loading, success, and error states are clear.
- [ ] Duplicate submission is prevented.
- [ ] Validation messages are translated.

---

## 5. Data and content

- [ ] Content ownership and freshness are clear.
- [ ] The least dynamic suitable data mode is used.
- [ ] Collections have schemas.
- [ ] Pages call named queries/services rather than raw endpoints.
- [ ] API URLs, headers, retries, and errors are centralized.
- [ ] External data is runtime-validated where needed.
- [ ] DTO/CMS shapes do not leak unnecessarily into the UI.
- [ ] Draft/private entries cannot reach production.
- [ ] Loading, empty, success, validation, and error states exist where applicable.
- [ ] Missing content returns appropriate status/fallback behavior.

---

## 6. Rendering and runtime

- [ ] Static rendering was considered first.
- [ ] A CMS integration did not trigger unnecessary SSR.
- [ ] Dynamic routes have documented freshness and caching needs.
- [ ] Adapter choice matches the hosting platform.
- [ ] Server islands are limited to isolated dynamic fragments.
- [ ] Server-island props are minimal and non-sensitive.
- [ ] Fallbacks avoid disruptive layout shifts.
- [ ] Personalized output cannot leak through shared caching.
- [ ] The change does not make Nuxt a more suitable framework.

---

## 7. TypeScript and environment safety

- [ ] `any` is absent or narrowly justified.
- [ ] Astro props are typed.
- [ ] Vue props, emits, models, and states are typed.
- [ ] Type-only imports are used where appropriate.
- [ ] Untrusted input uses `unknown` and validation/narrowing.
- [ ] Broad casts do not suppress real errors.
- [ ] Secrets use server-only environment access.
- [ ] Public environment values are intentionally public.
- [ ] Client imports do not pull server-only modules into the bundle.

---

## 8. Security and privacy

- [ ] No token, secret, or private endpoint is exposed.
- [ ] CMS rich text is structured or sanitized.
- [ ] No untrusted `set:html`, script, or raw SVG injection exists.
- [ ] Remote image and link sources are validated/allowlisted.
- [ ] Form validation exists server-side.
- [ ] Forms include appropriate abuse protection.
- [ ] Logs avoid tokens and personal data.
- [ ] Analytics/third-party scripts have approved purpose; GA4 respects enable/disable env contract; baseline CookieConsent opt-out is honored (`denied` stops collection).
- [ ] Preview and staging content is protected from indexing and unauthorized access.

---

## 9. Internationalization and RTL

- [ ] All active locales are implemented.
- [ ] No unintended visible hardcoded strings remain.
- [ ] `lang` and `dir` are correct.
- [ ] Locale folders and URLs match routing policy.
- [ ] The language switcher targets the translated equivalent.
- [ ] Missing translation behavior is deliberate.
- [ ] Logical/direction-aware styling is used.
- [ ] Icons and control direction were reviewed individually.
- [ ] Arabic text, numbers, emails, and mixed content display correctly.
- [ ] RTL keyboard behavior is tested for direction-sensitive controls.
- [ ] Dropdown, Sheet, Carousel, input icons, and breadcrumb separators use the correct direction.

---

## 10. SEO

- [ ] Indexable routes have unique title and description.
- [ ] Canonical is absolute and locale-correct.
- [ ] Alternate language links are reciprocal and valid.
- [ ] Open Graph values and image URLs are correct.
- [ ] Robots policy matches route intent.
- [ ] Redirects do not create chains or soft 404s.
- [ ] Structured data matches visible content.
- [ ] Primary SEO content exists in initial HTML.
- [ ] Sitemap behavior includes/excludes the route correctly.
- [ ] Preview/search/filter routes do not create unintended indexable duplicates.

---

## 11. Accessibility

- [ ] Semantic HTML is used before ARIA.
- [ ] Heading hierarchy is logical.
- [ ] Landmarks and skip navigation are present where applicable.
- [ ] All controls have accessible names.
- [ ] Form labels, help, and errors are associated.
- [ ] Keyboard-only operation works.
- [ ] Focus is visible and ordered logically.
- [ ] Overlay focus behavior is correct.
- [ ] Informative images have accurate alt text; decorative images use empty alt.
- [ ] Color is not the only state indicator.
- [ ] Reduced motion is respected.
- [ ] Touch targets and zoom/large-text behavior are acceptable.
- [ ] Dialog focus is trapped when required and restored after close.
- [ ] Escape and outside-click behavior match the component semantics.
- [ ] Disabled and loading states are exposed semantically.

---

## 12. Styling and design system

- [ ] Design tokens are used for system values.
- [ ] Semantic theme variables are used where theme mapping matters.
- [ ] Tailwind classes remain readable and statically detectable.
- [ ] Ordinary UI uses Tailwind utilities; Pure/Raw CSS is limited to tokens, theme, view transitions, keyframes, or generated-content selectors.
- [ ] Repeated arbitrary values were promoted to tokens where appropriate.
- [ ] Parent/child spacing ownership is clear.
- [ ] Responsive behavior is verified between breakpoints.
- [ ] Focus, hover, active, disabled, loading, and error states exist.
- [ ] No unnecessary global CSS exists.
- [ ] No unjustified `!important` exists.
- [ ] Theme variants work for images, logos, and integrations.
- [ ] Light and Dark modes were tested.
- [ ] UI Primitive styles are separated from Composite Pattern layout styles.
- [ ] Dynamic Tailwind class fragments and broad safelists are absent.

---

## 13. Images, fonts, and media

- [ ] Processable local images are outside `public`.
- [ ] Astro `Image`/`Picture` is used where appropriate.
- [ ] Remote image sources are configured safely.
- [ ] Dimensions/aspect ratios prevent layout shift.
- [ ] The LCP image is loaded deliberately and is not lazily loaded.
- [ ] Below-the-fold media is deferred appropriately.
- [ ] Oversized source assets are avoided.
- [ ] Fonts are licensed, subsetted, limited to used weights, and locale-preloaded (Tajawal/`ar`, Manrope/`en` — not both on every page).
- [ ] Inline SVG is trusted and reasonably small.
- [ ] Media works in both locales and themes.

---

## 14. Performance

- [ ] Static sections ship no client JavaScript.
- [ ] Hydration count and directives are reasonable.
- [ ] No duplicate UI framework or runtime was added.
- [ ] Third-party scripts are minimized and deferred.
- [ ] Client bundles for substantial islands were inspected.
- [ ] Layout shifts are controlled.
- [ ] Production build performance was reviewed.
- [ ] The PR does not regress agreed budgets without justification.
- [ ] Below-the-fold interaction uses `client:visible` where appropriate.
- [ ] Images are optimized.
- [ ] Autoplay is absent unless justified, pausable, and Reduced Motion aware.
- [ ] No console errors or Hydration warnings exist.
- [ ] Unused experimental components were removed or their Design System retention and CSS impact were reviewed.

---

## 15. Testing and validation

- [ ] Pure logic/schema/mapper tests were added or updated.
- [ ] Browser interaction has Playwright coverage.
- [ ] Keyboard/focus behavior is tested where relevant.
- [ ] RTL/LTR cases are covered.
- [ ] SEO/content contracts are tested where high-risk.
- [ ] Failure states are tested.
- [ ] Tests use resilient semantic locators.
- [ ] No arbitrary sleeps or unexplained flaky retries exist.
- [ ] `astro check` passes.
- [ ] Vue type check passes when applicable.
- [ ] lint and format checks pass.
- [ ] production build passes.
- [ ] required E2E tests pass.

---

## 16. Dependency changes

- [ ] Built-in and existing solutions were evaluated.
- [ ] The dependency solves a material problem.
- [ ] Client/runtime impact is understood.
- [ ] Maintenance, license, and security are acceptable.
- [ ] The package does not introduce another UI framework.
- [ ] Configuration and ownership are documented.
- [ ] Lockfile change is expected and focused.
- [ ] No package-manager change occurred.

---

## 17. Final review output template

```md
## Critical issues

- ...

## Important improvements

- ...

## Optional refinements

- ...

## Validation status

- Architecture: pass/fail
- Type checks: pass/fail/not run
- Tests: pass/fail/not run
- Build: pass/fail/not run
- RTL/i18n: pass/fail/not applicable
- Accessibility: pass/fail/not fully verified
- SEO: pass/fail/not applicable
```

If the code is acceptable, state that clearly without generic praise.


---

## 18. SOP traceability

- [ ] Feature ID and milestone are referenced.
- [ ] Project docs were updated where required.
- [ ] New routes/components/islands/integrations were previously documented.
- [ ] The PR does not exceed the repository's application ownership.
- [ ] Cross-repository dependencies are linked.
- [ ] No fake runtime content was introduced to hide an incomplete integration.
