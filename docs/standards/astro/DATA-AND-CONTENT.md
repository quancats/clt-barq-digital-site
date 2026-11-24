# Astro Data, CMS, and Content Standard

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

# Data and Content Standard

## Purpose

This document defines how Astro projects obtain, validate, transform, cache, render, and update content from local files, CMS platforms, and APIs.

The default goal is to make content available during the build and ship stable HTML. Runtime and client fetching are exceptions based on freshness or user interaction.

---

## 1. Content-source decision order

Choose the first option that meets the requirement:

1. static content in the page for a small, unique route
2. local typed dictionaries or data modules
3. build-time Content Collections for repeated structured content
4. remote CMS data through a build-time loader
5. build-time API service plus schema validation
6. CMS webhook that triggers a rebuild
7. on-demand route using stored build-time content
8. live collection for request-time freshness
9. client-side request for user-driven interaction

Do not choose runtime fetching merely to avoid configuring rebuilds.

---

## 2. Content ownership must be explicit

Every route or major section must identify its source:

- static repository content
- local Content Collection
- remote build-time CMS collection
- live CMS/API data
- backend API
- hybrid

Document ownership before implementation:

```text
Route: /ar/services/[slug]
Source: Remote CMS build-time collection
Freshness: Rebuild on publish webhook
Fallback: Build fails on invalid required fields
Locale model: Separate entry per locale
```

Unknown content ownership is an architecture blocker.

---

## 3. Content Collections

Use a collection when several entries share a common shape and benefit from typed querying.

Typical collections:

- articles
- services
- team members
- projects or case studies
- testimonials
- FAQs
- legal documents

Define build-time collections in `src/content.config.ts`.

Example:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    locale: z.enum(['ar', 'en']),
    title: z.string().min(1),
    description: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = { articles };
```

Rules:

- schemas are required for production collections
- IDs/slugs must be stable and unique
- drafts must be excluded from production output
- locale must be explicit
- dates are normalized
- references between collections must be validated
- content queries belong in `lib/content/queries`

Do not call `getCollection()` independently in many unrelated components. Centralize repeated filters and ordering.

---

## 4. Build-time remote content

Prefer a custom build-time loader or a named service/query function for CMS content that can tolerate rebuild latency.

Benefits:

- HTML output
- schema validation before deployment
- reusable cached collection data
- image processing opportunities
- predictable SEO
- no visitor-facing CMS outage for already built pages

A remote loader must handle:

- authentication from server/build environment
- pagination
- rate limits
- locale fields
- draft exclusion
- stable IDs
- update detection
- validation errors
- source timeouts
- meaningful build errors

Do not expose CMS SDKs across pages and components.

---

## 5. Live content

Use a live collection only when request-time freshness matters more than static performance.

Examples:

- current availability
- rapidly changing prices
- CMS preview
- request-specific filtered content
- information that cannot wait for a rebuild

Live collections require:

- an approved adapter
- `src/live.config.ts`
- runtime schemas
- explicit error handling
- caching policy
- observability
- fallback behavior

Limitations and tradeoffs must be documented, including runtime dependency on the data source and reduced build-time image/content processing.

Do not use live collections for ordinary service pages, team profiles, or articles that can rebuild on publication.

---

## 6. API layer

Raw endpoint behavior belongs in `src/lib/api`.

Recommended structure:

```text
lib/api/
├── client.ts
├── errors.ts
├── pages.ts
├── services.ts
└── contact.ts
```

Example client:

```ts
import { API_BASE_URL } from 'astro:env/server';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(new URL(path, API_BASE_URL), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError('API request failed', response.status);
  }

  return (await response.json()) as T;
}
```

The example type cast does not validate runtime data. Validate untrusted responses with an approved schema at the service boundary.

### Client-side APIs

A Vue island that performs client requests imports a browser-safe API module that uses only public configuration and never contains secrets.

Do not import server-only environment modules into client islands.

---

## 7. DTOs, schemas, and view models

### DTO

Represents the transport or CMS shape.

### Runtime schema

Confirms untrusted data matches the expected shape.

### Internal/view model

Represents the normalized shape consumed by UI.

Use a mapper when:

- field names differ
- nested CMS fields are flattened
- locale variants are selected
- derived URLs or labels are produced
- optional values need safe defaults
- raw rich text becomes a render model

Example:

```ts
export interface ServiceDto {
  id: string;
  attributes: {
    title: string;
    short_description: string | null;
  };
}

export interface ServiceCardModel {
  id: string;
  title: string;
  description?: string;
}

export function mapServiceDtoToCard(
  dto: ServiceDto,
): ServiceCardModel {
  return {
    id: dto.id,
    title: dto.attributes.title,
    description: dto.attributes.short_description ?? undefined,
  };
}
```

Do not let raw CMS naming leak throughout templates.

---

## 8. Page access pattern

Approved:

```astro
---
import WebsiteLayout from '@/layouts/WebsiteLayout.astro';
import ServicesGrid from '@/components/astro/sections/ServicesGrid.astro';
import { getServicesPage } from '@/lib/content/queries/getServicesPage';

const page = await getServicesPage({ locale: 'ar' });
---

<WebsiteLayout seo={page.seo} locale="ar">
  <ServicesGrid services={page.services} />
</WebsiteLayout>
```

Rejected:

```astro
---
const response = await fetch(`${import.meta.env.API}/services?lang=ar`);
const raw = await response.json();
const services = raw.data.map(/* large mapping */);
---
```

The page may await a named query. It must not own transport details or large mapping behavior.

---

## 9. Rich text and untrusted content

Never inject untrusted HTML directly.

Preferred order:

1. structured content blocks rendered by allowlisted components
2. Markdown/MDX from trusted repository authors
3. sanitized HTML generated by an approved server-side pipeline

A CMS rich-text renderer must:

- allowlist block types
- escape plain text
- validate links and protocols
- handle headings consistently
- avoid author-controlled scripts/styles
- prevent raw SVG injection
- define behavior for unknown blocks

Do not use `set:html` with unsanitized CMS output.

---

## 10. Images from CMS or APIs

- allowlist remote domains or URL patterns
- require alt text or a deliberate decorative flag
- store width/height or infer dimensions safely
- define focal-point/crop behavior
- avoid rendering full original uploads when smaller transformations exist
- define fallback behavior for missing images
- keep image transforms consistent across locales

Do not trust an arbitrary remote image URL supplied by an end user.

---

## 11. Localization model

Choose one model per collection:

### Separate entry per locale

Recommended for independently managed content and localized slugs.

```text
articles/ar/example.md
articles/en/example.md
```

### One entry with locale fields

Acceptable for tightly coupled short content.

Avoid giant objects that contain every locale and are difficult to validate or query.

Define:

- translation linkage
- missing-translation behavior
- localized slug policy
- publication state per locale
- fallback policy

---

## 12. Freshness and rebuild policy

For each remote content source, document:

- acceptable delay
- rebuild trigger
- rebuild failure behavior
- cache invalidation
- editor preview path
- rollback process

Typical informational website policy:

```text
Publish in CMS
-> signed webhook
-> deployment rebuild
-> schema validation
-> production deployment
```

A failed content validation should normally block deployment rather than publish broken pages.

---

## 13. Caching

### Static content

Use immutable deployment assets and CDN caching appropriate to hashed files.

### On-demand pages

Define:

- browser/CDN cache control
- freshness window
- stale-while-revalidate policy where supported
- personalization restrictions
- invalidation method

### Live collections

Use loader cache hints or explicit platform policy where available. Do not cache personalized or sensitive output publicly.

Caching must be observable and documented. Avoid accidental caching of preview, authenticated, or form response data.

---

## 14. Error handling

### Build time

Required content failure should fail the build with a useful source and entry identifier.

Optional content may use a documented fallback.

### Request time

Differentiate:

- not found
- upstream timeout
- validation failure
- unauthorized/forbidden
- unexpected server error

Return the correct status or rewrite/redirect behavior. Do not silently render empty content for an upstream failure.

### Client islands

Provide:

- pending state
- validation state
- retry or recovery path where useful
- accessible status message
- protection against duplicate submissions

---

## 15. Forms and mutations

For simple contact or lead forms:

- use native form semantics
- validate on the server
- include CSRF/spam/rate-limit strategy appropriate to the backend
- minimize collected data
- show success and failure states
- preserve accessibility without client JavaScript where practical

Use native HTML Form and Astro when the form is simple, can submit directly to the server, and does not need immediate or complex Client Validation.

Use a Vue Island when the form needs conditional fields, a multi-step flow, dependent selects, file previews, dynamic arrays, autosave, rich feedback, or complex submission state. The approved stack is:

```text
Zod
+ vee-validate when needed
+ shadcn-vue Form UI Primitives
```

Shared form schemas belong in `src/lib/validation`. Server Validation remains mandatory and is the source of truth. Translate validation messages; associate Label, Description, and Error with each input; expose loading, success, and error states; and prevent duplicate submission.

Use Astro Actions only when a server adapter is already justified and Astro is the approved server boundary. If Laravel owns the business process, submit to Laravel through an approved API/service instead of duplicating workflow logic.

Never place secrets or private API keys in a Vue island.

---

## 16. Astro-to-Island data boundary

Resolve static data and CMS content in Astro whenever possible. Separate Content Data from Interactive State.

- pass only the small serializable props the Vue Island needs
- do not pass a full CMS payload when a normalized subset is sufficient
- do not pass secrets, server-only environment values, private fields, or server-only objects
- keep marketing copy and long-form content in content sources or Astro Components when it does not depend on interaction
- keep content schemas separate from Zod form-validation schemas
- preserve important content in Server-rendered HTML rather than fetching it after Hydration

---

## 17. Security checklist

- [ ] Secrets are server/build-only.
- [ ] External data is validated.
- [ ] Rich text is structured or sanitized.
- [ ] URLs and protocols are validated.
- [ ] Remote image sources are allowlisted.
- [ ] Draft/private content is excluded.
- [ ] Logs do not expose personal data or tokens.
- [ ] Forms have server validation and abuse controls.
- [ ] Preview routes are protected.

---

## 18. Review checklist

- [ ] Content ownership is documented.
- [ ] The least dynamic suitable source mode is used.
- [ ] Collections have schemas.
- [ ] Pages call named queries/services instead of raw endpoints.
- [ ] DTOs do not leak unnecessarily into UI.
- [ ] Locale and slug relationships are explicit.
- [ ] Rich text and media are handled safely.
- [ ] Freshness, caching, and failure behavior are defined.
- [ ] Dynamic flows include all meaningful UI states.


---

## 19. Laravel/Filament CMS contract

When Laravel/Filament owns content:

- database schema is defined in backend documentation
- API contract is defined in shared system documentation
- Astro owns DTO validation, mapping, route generation, and rendering
- editorial publication states must be explicit
- draft/preview access must be protected
- media URLs and transforms must be approved
- webhook rebuild behavior must be documented

## 20. No fabricated runtime data

If the required API, CMS endpoint, SDK, or content entry does not exist, stop and report the missing integration. Do not replace it with runtime fake data unless explicitly requested.

## 21. CMS model discovery

An existing Astro site may be analyzed to propose a CMS content model, but the result is a candidate design requiring human review. Repeated visual sections do not automatically become database tables; ownership, reuse, locale, ordering, and editorial workflow determine the model.
