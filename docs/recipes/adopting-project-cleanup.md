# Recipe: Adopting-project cleanup

## Entry conditions

- You forked or copied `astro-template` into a real product repository.
- Demo catalog and/or sample articles are not part of the product scope.
- You need a governed ownership handoff from template SemVer files to product SemVer files.

## Goals

- Remove demo surfaces safely without leaving broken nav, tests, budgets, or docs links.
- Keep or retire template provenance deliberately.
- Never edit managed `docs/standards/**` for project-only exceptions (use overrides).

## Ownership after adoption

| Artifact                                                                                   | Owner after adoption                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Root `CHANGELOG.md`, `VERSION.md`                                                          | Product SemVer history                                                                                                         |
| `docs/system/*`                                                                            | Product governance                                                                                                             |
| `docs/astro/*` maps                                                                        | Project frontend maps (update; do not delete blindly)                                                                          |
| `docs/TEMPLATE-CHANGELOG.md`, `docs/TEMPLATE-VERSION.md`, `docs/astro/FEATURE-BASELINE.md` | Either retain as frozen provenance **or** remove after recording the source template version/commit and eliminating references |
| `docs/standards/*`                                                                         | Managed — do not edit locally                                                                                                  |
| `docs/standards-overrides/PROJECT-OVERRIDES.md`                                            | True project exceptions only                                                                                                   |

Do **not** create parallel owners such as both `docs/system/PLAN.md` and `IMPLEMENTATION-PLAN.md`, or duplicate `PROJECT-ISSUES.md` under `docs/issues/` and `docs/system/`.

## Remove component catalog (common)

Delete when unused:

- `src/components/astro/sections/components/AstroIconsDemo.astro`
- `src/components/astro/sections/components/ComponentsCatalog.astro`
- `src/components/islands/interactive/ComponentCatalog.vue`
- `src/lib/content/queries/createComponentsPage.ts`
- `src/lib/ui/componentCatalog.ts`
- `src/pages/{ar,en}/components/index.astro`
- `src/i18n/dictionaries/{ar,en}/components.ts`
- `tests/unit/componentCatalog.test.ts`

Then:

1. Remove catalog entries from navigation dictionaries and any CTAs.
2. Update e2e specs that visit `/components`.
3. Remove the `catalog` entry from `ISLAND_BUDGETS` in `scripts/check-performance-budget.mjs`.
4. Remeasure with `npm run build` then `npm run verify:budget`.
5. Update `docs/astro/{ROUTE-MAP,SCREEN-MAP,COMPONENT-MAP,ISLAND-MAP,I18N-MAP,RENDERING-MATRIX,PERFORMANCE-BUDGET}.md`.

## Remove sample articles (optional)

- Delete fixture articles under `src/content/articles/{ar,en}/` if the product has no articles surface.
- Decide explicitly: keep empty collections, mark routes `noindex`, or remove article routes/RSS entirely.
- If RSS/MDX are removed from runtime, also remove unused npm dependencies in the same change.

## Performance budget note

Island budgets are data-driven in `scripts/check-performance-budget.mjs`. Removing an island means removing its budget entry, not commenting out scattered assertions. Always remeasure after build; do not copy another project's gzip numbers blindly.

## Command layers during cleanup

```bash
npm run validate
npm run build
npm run verify
```

Do not run `fix:*` inside verification. Prefer `verify:e2e` only after `build`.

## Acceptance checks

- No `/components` navigation, routes, sitemap entries, imports, or stale tests (when catalog removed)
- Empty/removed articles behavior is documented and tested
- `npm run build`, `npm run verify:links`, and e2e pass
- Docs contain no references to removed islands/routes
- Template provenance and product SemVer ownership are explicit
- `docs/standards/*` unchanged

## Out of scope

- Shipping client biographies, brand tokens, or personal favicons into the shared template
- Editing managed standards generators for project wording
