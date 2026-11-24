# Astro Testing and Release Quality Standard

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

# Testing and Quality Gates

## Purpose

This document defines the required testing layers, validation commands, browser coverage, accessibility checks, CI gates, and release evidence for Astro projects.

Testing should protect behavior and contracts, not maximize file counts or snapshot volume.

---

## 1. Quality layers

Use the cheapest reliable layer for each risk:

1. static analysis and type checking
2. unit tests
3. integration/render tests
4. end-to-end browser tests
5. manual exploratory and visual review
6. production monitoring after release

Do not rely on one layer to replace all others.

---

## 2. Required static checks

Every project must provide equivalents for:

```bash
astro check
eslint .
prettier . --check
astro build
```

When Vue is installed:

```bash
vue-tsc --noEmit
```

Notes:

- Astro/Vite transformation is not a substitute for type checking
- Vitest executes TypeScript but does not by itself prove all project types are valid
- production builds catch route generation, content schema, and environment issues that development mode may not expose

---

## 3. Unit tests with Vitest

Use unit tests for:

- pure utilities
- URL and canonical helpers
- locale helpers
- metadata factories
- schema validation
- DTO/content mappers
- filters and sort logic
- variant functions
- content-query behavior with fixtures

Example:

```ts
import { describe, expect, it } from 'vitest';
import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

describe('createCanonicalUrl', () => {
  it('creates a locale-specific absolute URL', () => {
    expect(
      createCanonicalUrl({
        site: new URL('https://example.com'),
        path: '/ar/about/',
      }).toString(),
    ).toBe('https://example.com/ar/about/');
  });
});
```

Rules:

- test public behavior
- avoid testing framework internals
- use stable fixtures
- test error and edge cases
- do not mock everything by default
- avoid snapshots for simple values better expressed by direct assertions

---

## 4. Content and schema tests

Content tests should verify:

- required fields
- unique IDs/slugs
- supported locale values
- translation links
- draft exclusion
- canonical path uniqueness
- valid internal links where practical
- image metadata requirements
- structured-data prerequisites

Critical content failures should also fail the production build.

For remote CMS fixtures, keep representative success and malformed examples.

---

## 5. Astro component tests

Test Astro components when they provide a meaningful contract such as:

- semantic element selection
- generated metadata
- accessible labeling
- variant output
- structured content rendering

Do not test every static section only because it is a component.

Prefer browser-level tests when layout, focus, CSS, or hydration behavior matters.

---

## 6. Vue island tests

For local reactive logic, use unit/component testing when it adds value.

For the final interaction, use Playwright in a real browser.

Test:

- initial server-rendered state
- successful hydration
- input and state transitions
- disabled/loading/error states
- emitted or submitted data
- keyboard behavior
- focus management
- behavior without optional data
- RTL when direction-sensitive

Do not test a Reka primitive's internal implementation. Test the behavior promised by the internal wrapper.

---

## 7. End-to-end tests with Playwright

Required high-value journeys normally include:

- homepage loads and primary navigation works
- each locale has correct `lang` and `dir`
- language switch reaches the translated equivalent
- important route families return expected status
- primary CTA works
- contact/lead form success and validation behavior
- mobile navigation keyboard/focus behavior
- canonical and key metadata are present
- 404 behavior
- no obvious console errors

Use resilient locators in this order:

1. role and accessible name
2. label
3. visible text where stable
4. explicit test ID only when semantic locators are insufficient

Do not locate elements by styling classes.

---

## 8. Browser matrix

Minimum CI coverage:

- Chromium

Before major release or for client requirements:

- Chromium
- Firefox
- WebKit

Also review:

- common mobile viewport
- desktop viewport
- narrow intermediate width
- RTL and LTR
- light/dark themes where supported
- reduced-motion preference

Use project-specific expansion for older enterprise browser requirements.

---

## 9. Accessibility testing

Automated checks may use an approved Axe integration, but automation does not replace manual testing.

Required manual checks for meaningful interactions:

- keyboard-only navigation
- visible focus
- logical focus order
- overlay focus trap and restoration
- form label/error association
- heading and landmark structure
- zoom/large text behavior
- reduced motion
- screen-reader spot check for critical flows when practical

Accessibility regressions in primary navigation or forms are release blockers.

---

## 10. SEO tests

Automate high-risk SEO contracts:

- unique title and description for route fixtures
- absolute canonical URL
- locale-specific canonical
- reciprocal alternates
- one indexable URL per content identity
- noindex on preview/search routes
- expected Open Graph tags
- valid JSON serialization for structured data
- sitemap contains required route samples

Do not create brittle tests for exact marketing wording unless the wording is a legal or contractual requirement.

---

## 11. Visual and responsive review

Visual testing may be:

- manual screenshot review
- Playwright screenshots for stable components/routes
- external visual regression platform after approval

Use visual snapshots selectively for:

- layout shells
- high-value shared components
- RTL/LTR variants
- themes
- critical responsive sections

Avoid snapshotting every page and accepting updates without review.

Manual responsive review must include widths between design frames.

---

## 12. Performance validation

At minimum review production output for:

- unnecessary client scripts
- hydration count and directives
- image dimensions and formats
- LCP media loading
- font requests (active locale family only when bilingual pairing is used)
- third-party scripts (GA4 absent when disabled/unset/opted-out; present when production-configured and preference is not `denied`)
- layout shift

For substantial public sites, record an agreed Lighthouse/Web Vitals baseline or another production performance benchmark.

Performance tests should use production builds and stable conditions. Do not use one local score as an absolute guarantee.

---

## 13. Test data and fixtures

- no real personal data
- no production tokens
- deterministic dates and IDs
- representative Arabic and English text
- long and short content cases
- missing optional fields
- invalid external data fixtures
- stable image placeholders

Keep fixtures near the test domain or in `tests/fixtures` when reused.

---

## 14. Network behavior in E2E tests

Prefer testing against a stable local/test backend or deterministic route mocks.

When mocking:

- mock at the network boundary
- keep request/response contracts realistic
- test failure and latency when meaningful
- avoid coupling tests to implementation-only calls

A separate limited integration suite may verify the real staging API/CMS, but it must not make every PR dependent on an unstable external service.

---

## 15. CI pipeline

Recommended order (each layer runs **once** per CI invocation):

```text
install with lockfile (npm ci)
-> validate (source gates: format check, lint, astro check, vue-tsc, unit tests)
-> build (production artifact only — no embedded typecheck when validate already ran)
-> verify:budget + verify:links + verify:e2e (against dist/ / preview; no rebuild)
-> upload static-dist artifact on success; Playwright report on failure
```

Command layers (see §17):

| Layer      | CI runs? | Purpose                                      |
| ---------- | -------- | -------------------------------------------- |
| `fix:*`    | No       | Local/agent auto-fix only                    |
| `validate` | Yes      | Source gates without mutating tree           |
| `build`    | Yes      | Produce `dist/` only                         |
| `verify:*` | Yes      | Assert on built output / running preview     |

Rules:

- CI must not run `fix:*`
- `build` must not re-run `astro check` / `vue-tsc` when `validate` already ran them
- `verify:e2e` assumes a prior production build (Playwright uses `dist/` / preview)
- Projects may trigger CI on `push`/`pull_request` or **`workflow_dispatch` only** — document the choice in project DEPLOYMENT

Use caching carefully without hiding dependency or generated-type changes.

CI must fail on:

- type errors
- lint errors
- content schema failure
- build failure
- failed required tests
- missing generated routes required by test fixtures

---

## 16. Flaky tests

Flakiness is a defect.

Do not solve it with arbitrary sleeps.

Use:

- web-first assertions
- role-based locators
- stable test data
- explicit network state
- isolated browser contexts
- trace viewer and screenshots

Quarantining a test requires an owner, reason, and resolution issue.

---

## 17. Required scripts

Organize scripts by **layer** so CI and local workflows do not duplicate work.

| Layer                              | Mutates tree?             | Examples                                                 |
| ---------------------------------- | ------------------------- | -------------------------------------------------------- |
| `fix:*`                            | Yes                       | `fix:format`, `fix:lint`                                 |
| `validate`                         | No                        | `format:check`, `lint`, `check`, `typecheck:vue`, `test` |
| `build`                            | Build output only         | `astro build`                                            |
| `verify:*`                         | No source rewrite         | `verify:budget`, `verify:links`, `verify:e2e`            |
| `dev` / `preview` / `experiment:*` | Experiment artifacts only | `dev`, `preview`                                         |

Suggested `package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "preview": "astro preview",
    "fix:format": "prettier . --write",
    "fix:lint": "eslint . --fix",
    "format:check": "prettier . --check",
    "lint": "eslint .",
    "check": "astro check",
    "typecheck:vue": "vue-tsc --noEmit -p tsconfig.vue.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "validate": "npm run format:check && npm run lint && npm run check && npm run typecheck:vue && npm test",
    "build": "astro build",
    "verify:budget": "node scripts/check-performance-budget.mjs",
    "verify:links": "node scripts/check-internal-links.mjs",
    "verify:e2e": "playwright test",
    "verify": "npm run verify:budget && npm run verify:links && npm run verify:e2e",
    "ci:local": "npm run validate && npm run build && npm run verify"
  }
}
```

Transitional aliases (one release cycle): `format` / `format:fix` → `fix:format`; `test:budget` / `test:links` / `test:e2e` → `verify:*`.

Migration notes:

- Adopters relying on `npm run build` to typecheck must run `npm run validate` (or `check` + `typecheck:vue`) explicitly
- `npm run verify:e2e` (or legacy `test:e2e`) does not build; run `npm run build` first or use `ci:local`

When Vue exists, include Vue type checking in `validate`, not embedded inside `build`.

---

## 18. Definition of tested

A change is adequately tested when:

- its important pure logic has direct tests
- its user interaction is verified in a browser
- its locale/RTL impact is covered
- its metadata/content contract is validated when relevant
- failure states are exercised
- tests do not depend on arbitrary timing
- the production build succeeds
- manual review covers visual aspects automation cannot establish

---

## 19. PR evidence

A PR should state:

```md
### Validation

- [ ] `npm run validate` (or equivalent: format check, lint, `astro check`, Vue typecheck, unit tests)
- [ ] `npm run build`
- [ ] `npm run verify` (or `verify:budget`, `verify:links`, `verify:e2e`)
- [ ] RTL/LTR review
- [ ] responsive review
- [ ] accessibility review
- [ ] SEO review
```

Only mark checks actually performed. For docs-only changes, full `verify:*` is not required unless routes, links, or build output changed.


---

## 20. Contract and CMS integration testing

For Laravel/Filament or headless CMS integrations, test representative valid and invalid payloads, publication states, locale gaps, duplicate slugs, media metadata, webhook/rebuild behavior where possible, and frontend failure handling.

## 21. No fake-data acceptance

Test fixtures are allowed and required where useful. Runtime fake data in production code is not a substitute for an unavailable integration.
