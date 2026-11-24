# Astro Quick Guide

## Official UI stack

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

## Daily rules

1. Astro for content-first websites; Nuxt for app-like frontends.
2. Static output first — no adapter/SSR/Actions/CMS SDK until a Feature ID and ownership justify them.
3. Astro Component first; Vue Island only for justified interaction.
4. No Hydration by default; choose the least aggressive Client Directive.
5. Pages orchestrate and call named queries.
6. Use `components/core`, `components/layout`, `components/astro`, `components/ui`, `components/islands`, and `components/patterns`.
7. Prefer reviewed shadcn-vue UI Primitives; do not install Nuxt UI permanently.
8. Use `astro-icon` with Lucide for UI icons and Simple Icons only for company and platform logos.
9. Locale-paired fonts via Astro Fonts: Tajawal (`ar`) + Manrope (`en`); preload the active locale only.
10. GA4 uses official `gtag.js` in production when configured (loads by default); disable with `PUBLIC_GOOGLE_ANALYTICS_ENABLED=false` or unset ID; CookieConsent is opt-out only (`denied` stops collection).
11. No raw API/CMS details in UI.
12. No fake runtime data without explicit approval.
13. All locales, SEO, RTL, Dark Mode, and accessibility are part of the feature.
14. No new dependency without a proposal and approval; use the repository’s package manager (this starter: **npm** + `package-lock.json`).
15. Prefer platform-neutral recipes under `docs/recipes/` over shipping host/CMS/form runtime into the shared baseline (GA4 + CookieConsent are baseline).
16. Every change maps to a Feature ID, milestone, and documentation update.
17. Keep `prefixDefaultLocale: true` (`/ar`, `/en`); do not adopt unprefixed default-locale URL schemes from external checklists without an ADR.

## Before adding a Vue Island

- Can native HTML solve it?
- Can CSS solve it?
- Can an Astro Component or focused script solve it?
- Does a shadcn-vue UI Primitive or Composite Pattern already exist?
- Is state cohesive in one Island?
- Which Client Directive is the least aggressive?
- What remains usable if JavaScript fails?

## Before merging

Run type checks, lint, formatting, unit tests, production build, required E2E, Light/Dark, RTL/LTR, accessibility, SEO, Hydration warning review, and documentation update.
