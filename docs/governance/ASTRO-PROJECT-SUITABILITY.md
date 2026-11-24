# Astro Project Suitability Gate

## Objective

Prevent choosing Astro for a frontend that is actually an application shell better served by Nuxt.

## Suitable by default

- public informational websites
- corporate and brand websites
- campaigns and landing pages
- portfolios
- blogs, magazines, documentation, and knowledge sites
- multilingual public sites
- static or rebuild-driven headless CMS sites
- public directories and catalogues dominated by indexable content
- sites with a small number of isolated interactions

## Conditional

Architecture review is required for:

- authentication attached to public pages
- protected preview
- live search over frequently changing data
- current availability or pricing
- server-owned forms
- personalization
- thousands of generated paths
- mixed static and on-demand route families

## Prefer Nuxt

- dashboards and internal systems
- authenticated application shells
- extensive shared client state
- real-time collaboration
- complex account workflows
- many client-heavy grids or editors
- most routes requiring hydration or request-time user data

## Scoring questions

Answer yes/no:

1. Can most routes be delivered as HTML without hydration? **Yes**
2. Is the primary value content and navigation? **Yes**
3. Can CMS publication freshness be handled with rebuilds? **Yes** (local content / future rebuild-driven CMS)
4. Can interactions remain isolated islands? **Yes** (none required in baseline)
5. Can Laravel own business mutations and authentication? **N/A** (none in baseline)
6. Is SEO/indexability a major requirement? **Yes**
7. Is shared client state limited? **Yes** (none)

## Verdict

Astro

## Evidence

- Template purpose is bilingual public content and informational pages.
- Baseline has no auth shell, dashboard, or shared client state.
- Content Collections and static HTML satisfy SEO and rebuild freshness.
- Organization standards designate Astro for this class of site.

## Conditional requirements

- Vue islands only after island approval checklist
- CMS/API only after contracts and ownership docs
- Adapter/SSR only when on-demand features are approved

## Risks

- Adopters may stretch the template into an app shell; suitability must be re-evaluated then.

## Decision owner

Frontend / template maintainers (ADR-0001)
