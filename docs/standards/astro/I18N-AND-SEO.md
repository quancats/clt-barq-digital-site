# Astro Internationalization and SEO Standard

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

# Internationalization and SEO Standard

## Purpose

This document defines locale routing, translation ownership, RTL/LTR behavior, metadata, canonical URLs, alternate languages, sitemaps, robots rules, social previews, and structured data.

For bilingual projects, Arabic and English are equal release targets. Language support is architecture, not late content polish.

---

## 1. Locale strategy must be decided before pages

Confirm before implementation:

- supported locales
- default locale
- whether the default locale is prefixed
- route folder structure
- localized slug policy
- fallback behavior
- content ownership per locale
- language-switch behavior
- indexability of incomplete locales

The standard Quancats website baseline is:

```text
Locales: ar, en
Default locale: ar
URL strategy: prefix every locale (`prefixDefaultLocale: true`)
Trailing slash: always (`trailingSlash: 'always'`)
Examples: /ar/about and /en/about
Direction: ar=rtl, en=ltr
Fonts: Tajawal (ar) + Manrope (en) via Astro Fonts; selective preload weight 400 + locale subset only
```

Do **not** unprefix the default locale (`prefixDefaultLocale: false` → `/about` + `/en/about`) based on external marketing checklists. That scheme is outside this baseline; projects may choose it only with an explicit ADR and full route/SEO/redirect updates.

Projects may choose another locale policy only when documented with ownership and acceptance criteria.

---

## 2. Astro i18n configuration

Example:

```ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: {
      prefixDefaultLocale: true,
      // Prefer false until Astro redirect behavior is verified for the project (see TD-002 in starters).
      redirectToDefaultLocale: false,
    },
  },
});
```

When all locales are prefixed, page files live in literal locale directories:

```text
src/pages/ar/about.astro
src/pages/en/about.astro
```

Do not use `src/pages/[locale]` as a substitute for Astro's built-in locale routing unless custom routing is intentional and reviewed.

---

## 3. Locale configuration

Create one typed source of truth:

```ts
export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
};
```

Do not repeat supported locales or direction checks across pages.

---

## 4. Document language and direction

The root layout must set both:

```astro
<html lang={locale} dir={direction}>
```

Rules:

- `dir` belongs on the document root unless a genuinely mixed-direction fragment needs an override
- use `dir="auto"` for user-generated text fields where appropriate
- phone numbers, emails, code, and Latin identifiers inside Arabic content may require isolated direction handling
- do not solve RTL by duplicating templates
- all Astro Components, Vue Islands, UI Primitives, and Composite Patterns must work with both `dir="rtl"` and `dir="ltr"`
- prefer CSS Logical Properties and do not assume `left` means inline start
- test Dropdown alignment, Sheet direction, Carousel direction, input icons, breadcrumb separators, navigation keyboard behavior, arrows, and chevrons in both directions
- flip only icons whose meaning depends on direction

---

## 5. Translation dictionaries

Recommended:

```text
src/i18n/dictionaries/
├── ar/
│   ├── common.ts
│   ├── layout.ts
│   ├── home.ts
│   └── services.ts
└── en/
    ├── common.ts
    ├── layout.ts
    ├── home.ts
    └── services.ts
```

Rules:

- same object shape between locales
- `snake_case` keys
- shared strings in `common`
- page strings in their page dictionary
- navigation/footer strings in `layout`
- do not place entire content articles in UI dictionaries
- do not construct sentences from translated fragments
- support pluralization and number/date formatting deliberately
- no visible hardcoded strings inside shared components unless they are language-neutral

Prefer typed dictionaries or a typed translation helper so missing keys fail during development.

---

## 6. Content localization

For CMS or collections, define one of:

### Separate entries per locale

Recommended for long-form or independently published content.

```text
article-id: example-ar / example-en
translationGroup: example
locale: ar / en
slug: Arabic or English slug
```

### Shared entry with localized fields

Acceptable for small tightly coupled records.

Document:

- translation relationship
- publication state per locale
- missing translation behavior
- localized slug ownership
- alternate URL generation

Do not publish a route in a locale when its content is materially incomplete unless the product explicitly accepts fallback content and its SEO consequences.

---

## 7. Language switcher

The switcher should navigate to the corresponding translated route, not merely replace `/ar/` with `/en/` blindly.

Required behavior:

1. resolve current route/content identity
2. find translated equivalent
3. navigate to the localized slug
4. fall back to the locale homepage only when no equivalent exists and policy allows it

It must:

- use links rather than JavaScript-only buttons
- expose clear language names
- preserve accessibility and keyboard operation
- avoid redirect loops
- avoid switching to a non-existent route

---

## 8. Route metadata model

Every indexable route must define:

- page title
- meta description
- canonical URL
- Open Graph title/description/image/type
- Twitter/X card data where required
- locale alternates
- robots policy
- structured data where relevant

Create a typed metadata model:

```ts
export interface PageSeo {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedAt?: Date;
  updatedAt?: Date;
}
```

Use one SEO component/helper rather than manually duplicating tags on every route.

---

## 9. Title and description standards

### Title

- unique per indexable route
- accurate and human-readable
- includes brand consistently
- avoids keyword stuffing
- localized naturally rather than literally

Recommended pattern:

```text
Page Topic | Brand
```

The homepage may use a stronger brand/value-proposition pattern.

### Description

- unique where practical
- describes visible route content
- contains no unsupported claims
- localized for language and market
- not a list of keywords

Search engines may rewrite descriptions; that does not remove the requirement to supply useful metadata.

---

## 10. Canonical URLs

Canonical URLs must:

- use the configured production `site`
- follow trailing-slash policy
- remove irrelevant query parameters
- point to the current locale version
- match redirects and route generation
- never point Arabic and English pages to one shared locale URL

Generate canonicals through one helper using URL APIs. Do not concatenate origins manually across pages.

Preview, filtered, campaign, duplicate, or paginated routes require explicit canonical decisions.

---

## 11. Alternate language links

For translated equivalents, output `hreflang` alternates.

Rules:

- each alternate must exist and be indexable
- include a self-reference
- use valid locale/region codes
- add `x-default` only when a real language-neutral/default selector route exists
- keep alternate sets reciprocal
- use localized slugs when applicable

Do not create alternates to fallback content that is not a true translation unless that policy is deliberate.

---

## 12. Open Graph and social previews

Define global defaults and route overrides.

Requirements:

- absolute image URL
- approved image dimensions and safe area
- locale-appropriate title and description
- accurate `og:type`
- article publication/update data where applicable
- stable fallback image

Do not render the same text into an image if the image can remain language-neutral. When social images contain text, generate or supply each locale version.

---

## 13. Structured data

Use JSON-LD only when it accurately represents visible content.

Possible types:

- `Organization`
- `WebSite`
- `BreadcrumbList`
- `Article`
- `Service`
- `Person`
- `FAQPage` only when content and current search-engine policy justify it

Rules:

- build data through typed helpers
- use absolute URLs
- keep values consistent with visible content
- escape safely through serialization
- do not add unsupported ratings, prices, addresses, or claims
- validate before release

Structured data is not a place for marketing exaggeration.

---

## 14. Sitemap

Public indexable projects should normally use `@astrojs/sitemap`.

Review:

- configured `site`
- locale mapping
- excluded noindex/private routes
- redirects and canonical duplicates
- CMS-generated paths
- last-modified data when reliable

A sitemap does not grant indexability; robots, status codes, canonicals, and content quality still govern search behavior.

---

## 15. Robots policy

Define separate behavior for:

- production
- preview/staging
- local development

Staging and preview environments must not become indexed. Use authentication and/or `noindex`; do not rely solely on `robots.txt` for private content.

Production `robots.txt` must reference the correct sitemap and must not accidentally block required assets.

---

## 16. Status codes and redirects

- missing content returns `404`
- moved routes use an intentional redirect status
- locale redirects do not create chains
- removed pages are redirected only when there is a genuinely equivalent destination
- soft 404 pages are prohibited
- error pages include appropriate language and direction

Do not redirect every missing content page to the homepage.

---

## 17. Pagination, filters, and search

Define indexability intentionally:

- paginated article pages may be indexable when they provide unique discovery value
- filter combinations are usually non-indexable unless curated
- internal search result pages are normally `noindex`
- query parameters must not create uncontrolled canonical duplicates

Use real links for crawlable pagination, not JavaScript-only controls.

---

## 18. Performance and SEO

SEO-critical content must:

- exist in initial HTML
- not depend on a client-only component
- use optimized images
- avoid layout shifts
- avoid third-party scripts that delay interaction or rendering
- preserve semantic heading and landmark structure

Do not render hero text, primary navigation links, FAQ content, article body, or metadata-dependent content only after Hydration. A Carousel must not hide essential content from search engines or users.

UI Islands must receive or derive page `locale` and `dir` explicitly. Forms, validation messages, accessible labels, and interactive status text must use the translation system. Shared UI Primitives must not hardcode translatable copy. Arabic and English implementations must be functionally equivalent, not merely visually translated.

Navigation links and important content must remain in Server-rendered HTML even when a Vue Island enhances their interaction.

---

## 19. Themes across locales

Theme state is global page state, not separate state recreated inside every Vue Island. Use one source of truth and semantic CSS variables, initialize it before first paint where possible, and prevent a flash of incorrect theme.

Test Dialog, Dropdown, Forms, Carousel, and direction-sensitive icons in Light and Dark modes for both LTR and RTL. Theme changes must not alter language semantics, focus visibility, or contrast.

---

## 20. Release checks

For every active locale:

- [ ] Route exists and returns expected status.
- [ ] `lang` and `dir` are correct.
- [ ] Title and description are localized.
- [ ] Canonical points to the same locale.
- [ ] Existing translations have reciprocal alternates.
- [ ] Open Graph image and URL are absolute.
- [ ] Heading structure is valid.
- [ ] Navigation and language switcher work.
- [ ] No unintended fallback or hardcoded language exists.
- [ ] Sitemap/robots policies are correct.
- [ ] Structured data validates and matches visible content.
- [ ] Staging remains non-indexable.


---

## 21. CMS publication completeness

For CMS-driven bilingual routes, publication state must be known per locale. A route must not be emitted merely because another locale exists. Missing translation behavior must be deliberate and reflected in alternates, sitemap, and language switching.

## 22. AI and generated metadata

Metadata may be drafted by AI but must be reviewed against visible content. AI must not invent claims, ratings, service coverage, prices, addresses, authorship, or legal facts for SEO or structured data.
