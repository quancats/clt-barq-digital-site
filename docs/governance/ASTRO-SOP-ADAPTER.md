# Astro SOP Adapter

## Purpose

This document connects the company AI Project Start SOP to an Astro repository. Astro standards are an implementation layer, not the source of product truth.

## Authority order

1. project-specific approved overrides
2. system-level documents
3. application/repository-specific documents
4. Astro engineering standards
5. Cursor rules and operational prompts
6. existing local patterns that do not conflict with the above

## Required system documents

- `PROJECT-BRIEF.md`
- `PRODUCT-SCOPE.md`
- `SYSTEM-ARCHITECTURE.md`
- `APPLICATION-MAP.md`
- `DOMAIN-MAP.md`
- `FEATURE-REGISTRY.md`
- `API-CONTRACTS.md` when integrated with a backend
- `FLOW-MAP.md`
- `IMPLEMENTATION-PLAN.md`
- `DECISIONS.md`

## Required Astro repository documents

- Astro scope
- page inventory
- route map
- content ownership map
- rendering matrix
- locale/SEO map
- component inventory
- island map
- integration/dependency register
- performance budget
- deployment plan

## Non-negotiable gate

No page, route family, integration, Vue island, adapter, server route, CMS model, or dependency may be implemented unless ownership and the relevant project decision are documented.

## Multi-repository behavior

This repository may coexist with:

- Laravel API/CMS repository
- Filament administration repository
- mobile repositories
- shared documentation repository

Astro must consume approved contracts and must not duplicate backend business workflows. Cross-repository changes are recorded as dependencies in the milestone and issue.

## Conflict behavior

When code, project docs, and standards conflict:

1. do not guess
2. identify the conflict
3. mark whether it blocks implementation
4. propose the minimum documentation decision required
5. implement only after the authority is resolved
