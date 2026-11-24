# Astro Readiness Gate

## Purpose

Cursor must run this gate before meaningful implementation.

## Project readiness

- approved scope exists
- Astro suitability is confirmed
- repository ownership is clear
- active locales are confirmed
- target deployment is known
- content sources and owners are known
- page inventory and route map exist
- design tokens and global shell are approved
- SEO baseline is approved
- analytics/legal/form/consent requirements are known (GA4 env contract; consent only if required)
- package manager/lockfile policy is known
- optional `docs/recipes/` items in scope are listed when host/CMS/forms/header alternatives are expected

## Feature/page readiness

- Feature ID exists
- milestone exists
- affected routes are listed
- content source and freshness are documented
- static/on-demand decision exists
- component and island boundaries are understood
- API/CMS contracts exist if applicable
- acceptance criteria include both locales
- accessibility and testing expectations are defined
- expected files are known

## Blocking conditions

Do not implement when:

- route or content ownership is unknown
- a page is expected to invent missing content
- API/CMS shape is unknown
- a new dependency is assumed without approval
- the feature would require broad shared client state
- SSR/server output is proposed without deployment approval
- one locale is materially incomplete without an approved exception

## Verdict values

- Ready
- Ready with documented risks
- Not Ready
- Framework Review Required
