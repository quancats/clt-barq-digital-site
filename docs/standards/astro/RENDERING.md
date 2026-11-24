# Astro Rendering, Runtime, and Caching Standard

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

# Rendering and Runtime Standard

## Purpose

This document governs static generation, on-demand rendering, server islands, client islands, route caching, adapters, and runtime selection.

The default is static output. Runtime infrastructure is added only for routes or features that require it.

---

## 1. Rendering decision hierarchy

Use the first suitable option:

1. static page with no client JavaScript
2. static page with small progressive-enhancement script
3. static page with a deferred Vue island
4. static page rebuilt when CMS content changes
5. static page with a server island for isolated dynamic content
6. individual on-demand route
7. server output for most routes
8. use an application framework instead of Astro

Do not jump directly from static content to a fully server-rendered Astro deployment.

---

## 2. Static output

Static is required by default for:

- marketing pages
- service pages
- personal/portfolio pages
- articles and documentation
- case studies
- team pages
- legal pages
- ordinary CMS-driven informational content

Benefits:

- fastest delivery path
- strong cacheability
- minimal runtime cost
- resilience from CMS/API outages after build
- predictable SEO output
- reduced attack surface

A CMS does not imply SSR. Use build-time loaders and publication webhooks where freshness permits.

---

## 3. Route-level on-demand rendering

Use an official adapter and mark only required routes for on-demand rendering.

A route may be dynamic when it requires:

- request cookies or headers
- immediate draft preview
- current user-specific data
- frequently changing values that cannot wait for rebuild
- secure server-side form processing owned by Astro
- request-time redirects or authorization

Each dynamic route must document:

```text
Reason:
Data source:
Freshness requirement:
Caching policy:
Failure behavior:
Privacy classification:
Why static rebuild is insufficient:
```

Do not make a route dynamic solely because it uses route parameters. Dynamic slugs can be generated statically with `getStaticPaths()`.

---

## 4. Full server output

Use project-wide server output only when most routes genuinely require request-time execution.

Before approval, ask whether the project has crossed into application territory and would be better implemented in Nuxt.

Full server mode requires:

- capacity and scaling plan
- cache strategy
- health monitoring
- error reporting
- deployment rollback
- runtime environment validation
- security headers
- upstream timeout strategy

A server-rendered Astro site must not retain static-site assumptions about availability or cost.

---

## 5. Client islands

Vue Islands solve browser interaction. Astro still renders the page and initial HTML; Hydration sends the Vue runtime and component JavaScript to the browser so events and Client State can activate.

> Rendering a Vue component and hydrating it are different decisions. A Vue component can produce Server-rendered HTML without shipping its JavaScript. If it needs no browser interaction, do not add `client:*`.

Astro is the primary framework. Vue is a limited interactive layer, never the default page shell.

They do not solve:

- SEO
- data freshness by themselves
- server authorization
- secret access
- CMS validation

Use hydration according to interaction timing:

| Client Directive | Standard use |
|---|---|
| none | Server-rendered HTML with no browser state, events, or JavaScript requirement |
| `client:visible` | Below-the-fold FAQ, Carousel, Contact Form, or gallery |
| `client:idle` | Non-critical secondary interaction after primary browser work |
| `client:media` | Responsive-only interaction with a real delivery benefit outside the query |
| `client:load` | Critical interaction required immediately, such as a cohesive Site Header |
| `client:only="vue"` | Last-resort Browser API dependency that cannot render on the server |

Select the least aggressive Client Directive that satisfies the behavior. `client:load` and `client:only` require a PR justification; `client:only` also requires a nearby comment explaining why SSR is impossible.

Do not add a Client Directive automatically to every Vue component. Do not use `client:only` to hide SSR bugs or hydration mismatches.

### State boundaries and Island grouping

Define a Vue Island by the boundary of shared state and behavior, not by the number of visible elements. Navigation Menu, Dropdown Menu, Mobile Drawer, language switcher, theme switcher, and Search Dialog may belong in one `HeaderChrome` Island when they coordinate. Do not create separately hydrated roots that communicate through global events.

Avoid both Island proliferation and full-page Hydration. Each hydrated root adds client work and a runtime boundary; one giant page Island discards Astro's architecture.

### Examples

```astro
---
import FeatureGrid from '@/components/astro/sections/FeatureGrid.astro'
import HeaderChrome from '@/components/islands/interactive/HeaderChrome.vue'
import SecondaryActions from '@/components/islands/interactive/SecondaryActions.vue'
import FAQAccordion from '@/components/patterns/FAQAccordion.vue'
import DesktopMegaMenu from '@/components/islands/navigation/DesktopMegaMenu.vue'
---

<FeatureGrid items={features} />
<HeaderChrome client:load />
<SecondaryActions client:idle />
<FAQAccordion items={faqItems} client:visible />
<DesktopMegaMenu client:media="(min-width: 1024px)" />
```

---

## 6. Server islands

Server islands render an isolated dynamic Astro component after the surrounding page is delivered.

Appropriate cases:

- account indicator on an otherwise public page
- personalized greeting
- current stock/availability fragment
- location-specific small block
- expensive dynamic content that must not delay the main route

Requirements:

- official adapter
- clear fallback slot
- small serializable props
- no sensitive data in URLs
- explicit cache behavior
- acceptable layout stability

Do not use server islands for core indexable page content when static or route-level rendering is more appropriate.

Do not pass large arrays or objects as props. Server-island transport and URL constraints make small inputs essential.

---

## 7. Progressive enhancement

Before creating a Vue island, consider an Astro component plus a focused browser script.

Good candidates:

- copy button
- theme switch
- simple menu disclosure
- native dialog enhancement
- analytics event binding
- CSS-only Marquee

Rules:

- content and primary actions remain available without JavaScript when practical
- scripts query stable data attributes, not fragile styling selectors
- repeated execution is safe if navigation behavior changes
- listeners are cleaned up when required
- scripts do not include secrets or untrusted code

---

## 8. Dynamic routes and static paths

For statically generated dynamic routes:

- use a typed query to obtain route entries
- exclude drafts
- generate locale-specific params
- pass minimal props from `getStaticPaths()`
- return correct 404 behavior for missing content
- verify duplicate slugs

Do not perform independent full CMS downloads for each route if a collection/query can reuse build data.

---

## 9. Caching standard

### Static assets

- hashed build assets may use long-lived immutable caching
- public files without hashes need deliberate cache headers

### Static HTML

Set CDN policy according to deployment and publication requirements. Avoid stale legal or critical operational information beyond its accepted window.

### On-demand public HTML

Use explicit `max-age`, shared cache, and stale revalidation behavior supported by the platform. Document invalidation.

### Personalized HTML

Do not place user-specific or sensitive output in shared public caches.

### Upstream fetches

Define timeouts and cache behavior. Do not allow a slow CMS to hold a request indefinitely.

---

## 10. Adapters and deployment

Adapter choice follows hosting, not developer preference.

Before selecting an adapter, verify:

- supported runtime and Node compatibility
- environment-variable model
- cold-start behavior
- request/response limits
- streaming and server-island support
- image optimization behavior
- caching controls
- deployment regions
- logging and monitoring

For static projects, deploy the generated output without an adapter unless the hosting platform's official integration provides required build behavior.

---

## 11. Middleware

Use middleware only for request-wide concerns:

- locale redirects
- security headers where platform configuration is unavailable
- request IDs
- protected preview access
- limited redirects/rewrites

Do not place feature queries, page content, or ordinary UI orchestration in middleware.

Middleware increases runtime coupling and must not be added to a static deployment without understanding its hosting effect.

---

## 12. Redirects, rewrites, and status codes

- use permanent redirects only when the move is genuinely permanent
- preserve locale and query parameters where required
- do not create redirect chains
- return `404` for missing public content
- use `410` only for intentionally removed content when appropriate
- use rewrites for internal fallback behavior only when canonical and analytics behavior are understood
- verify trailing-slash and canonical policies together

---

## 13. Forms

### Static deployment

Use an external/backend endpoint, hosting form service, or approved API.

### Server deployment

Astro Actions or API routes may be used when Astro owns the server boundary.

In both cases:

- server validation is mandatory
- abuse prevention is mandatory
- success and error states are accessible
- duplicate submissions are handled
- personal data is minimized

Do not make the entire site server-rendered only for one contact form if a secure external backend already exists.

Use native HTML Form and Astro when submission is simple and immediate Client Validation is unnecessary. Use a Vue Island only for conditional fields, multi-step flows, dependent inputs, previews, dynamic arrays, autosave, or complex feedback. Client Validation never replaces Server Validation.

---

## 14. Error and fallback behavior

Define behavior for:

- missing content
- build-time source failure
- live source failure
- server-island timeout
- client-island load failure
- form failure

Static core content must remain usable if an optional island fails.

Server-island fallbacks must reserve reasonable space or avoid disruptive layout movement.

Do not hide infrastructure errors behind empty sections.

---

## 15. Performance requirements

- zero hydration for static page sections
- the least aggressive hydration directive
- no duplicate framework islands for one interaction
- no client-only route content intended for indexing
- stable image and server-island layout dimensions
- production bundle inspection for substantial islands
- third-party scripts production-only; GA4 when configured and not disabled; opt-out via baseline CookieConsent
- LCP content delivered in initial HTML
- no full-page Vue Hydration for ordinary content sites
- small serializable props passed to Vue Islands

Use production builds and browser tracing to investigate performance, not development-server impressions.

---

## 16. Rendering decision table

| Requirement | Recommended approach |
|---|---|
| CMS article updated a few times daily | Build-time collection + webhook rebuild |
| Draft preview | Protected on-demand route/live collection |
| Mobile menu | Vue island or focused native script |
| Current availability block | Server island or on-demand route with caching |
| Personal dashboard | Prefer Nuxt/application framework |
| Search over small static catalogue | Build-time index + deferred client island |
| Search over large changing data | Backend search API + interactive island |
| Contact form using Laravel backend | Static page posting to Laravel |
| User-specific header on public site | Server island after architecture review |

---

## 17. Review checklist

- [ ] Static output was considered first.
- [ ] Dynamic behavior has a documented requirement.
- [ ] Adapter choice matches deployment.
- [ ] Hydration is minimized.
- [ ] Core indexable content exists in initial HTML.
- [ ] Caching and invalidation are explicit.
- [ ] Personalized content cannot leak through shared cache.
- [ ] Fallback and error behavior are defined.
- [ ] The project has not become better suited to Nuxt.


---

## 18. Rendering approval record

Any deviation from static output must be recorded in `RENDERING-MATRIX.md` with owner, reason, privacy class, cache behavior, failure behavior, deployment requirement, and review date.

## 19. Astro 7 considerations

Projects upgrading to Astro 7 must review Vite 8 compatibility, the Rust compiler changes, reserved `src/fetch.ts`, Markdown processing changes, and HTML whitespace behavior before rollout. Framework upgrades are separate milestones.
