# Cursor Rule — Astro Project Governance

## Authority

Read and follow in this order:

1. project overrides
2. shared system documents
3. project-specific Astro maps
4. managed Astro standards
5. task instructions

## Mandatory preconditions

Before implementation, identify:

- Feature ID and milestone
- repository/application owner
- affected routes and Page IDs
- content owner and source
- rendering mode
- locales and SEO contract
- API/CMS dependency
- acceptance criteria and tests

## Blocking behavior

Do not implement undocumented routes, content types, server behavior, islands, integrations, dependencies, or CMS contracts.

When documentation is incomplete, return:

- readiness verdict
- missing decisions
- allowed scope
- forbidden scope
- required human review

## Scope control

Implement one coherent milestone only. Do not add unrelated pages, refactors, packages, or content. Update relevant project documentation after implementation.
