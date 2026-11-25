# Barq Digital v1.0 | Engineering preparation

Draft handoff dated 2026-11-25. The execution plan §5.1 permits discovery and drafting before milestone entry. The following checks and decisions apply to implementation after dependencies pass.

## MS-004 route contract

Keep `localizePath` as the generation boundary and migrate the Arabic page files and their callers together. Configure Arabic at the root and English under `/en/`, preserving directory output and trailing slashes. Reserve route IDs for stable page identity. Generate dynamic locale counterparts from the published content index using translation keys. For a missing counterpart, communicate unavailability in the current language and omit the counterpart link and SEO alternate. Keep the current URL and language available when JavaScript fails.

Verify the existing root redirect is removed when Arabic home moves to `/`. Reconcile existing `/ar/` preview references, tests and budget keys together. Audit navigation, canonicals, hreflang, sitemap, RSS and 404 links against the same target route map. The legacy inventory supplies candidate redirects for separate implementation in MS-036. Use explicit locales with `Intl.DateTimeFormat` and `Intl.NumberFormat`; define date-only formatting in UTC so output stays stable across build hosts. Cover root and nested routes, alternate slugs, absent translations, long localized labels and bidirectional content.

## MS-005 publication contract

The current `articles` schema has locale, translation group and draft status. Its query treats every non-draft article as public. Use a separate publication rule that requires a published state and approval reference. Migrate existing sample entries to test fixtures or exclude them from public build inputs. Keep the query and generated route manifest on the same validated set.

Use a shared schema for stable ID, locale, translation key, safe slug, title, description, status, approval reference, optional SEO, ordering and approved media metadata. Extend by collection for products, services, solutions, industries, projects, articles, news, resources, authors when used, and legal. Resolve internal references against the published index, validate uniqueness within a route family and locale, and require the approved counterparts mandated by the route register. Missing optional counterparts stay out of alternate links. Verify captions or alt text as appropriate, ownership references and build-safe media paths. Keep private approval evidence outside distributable assets.

Use isolated fixtures for positive bilingual publication, draft exclusion, duplicate route and locale keys, broken references, missing required counterparts, unsafe asset paths and missing rights or approval evidence. Define assertions at both the validation boundary and generated HTML or route manifest.

## MS-006 checks

Reuse `validate`, `build`, `verify` and the existing workflow. Add a focused content-validation entry point after the publication validator exists. Pair its positive fixture with a negative fixture that demonstrates a failed content gate. Record the clean install, build and review-check results separately from local checks. The hosted workflow currently uses manual dispatch. Resolve the review trigger and Git policy during integration with the existing workflow.

## MS-009 to MS-013 verification matrix

| Area                  | Existing baseline                                                                                                | Evidence required at acceptance                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens and typography | Semantic light/dark styles, approved palette recorded in `9af8729`, active locale font preload covered by tests. | Check approved font license and asset provenance, then run the representative showcase in both directions at narrow and wide widths. Verify semantic color combinations and focus visibility.            |
| Primitives            | Existing component catalog covers combobox focus return and form validation.                                     | Exercise approved component states including disabled, pending, invalid and successful states. Verify accessible names, error association and status announcements.                                      |
| Navigation            | Keyboard drawer behavior and AR/EN navigation tested with normal, delayed, blocked and disabled JavaScript.      | Check real published links and alternate availability, mobile scroll and focus, full desktop hierarchy, footer sources and translated labels.                                                            |
| Sections              | Base, website and content layouts render the current starter.                                                    | Verify approved corporate, commercial, article and legal fixtures with heading hierarchy and sparse data. Exercise absence of optional sections and trust claims.                                        |
| Integrated design     | Chromium suite covers four widths, long AR/EN content, reduced motion and automated accessibility.               | Check mixed-direction names and assistive technology manually, verify all approved fixtures and record designer/technical lead sign-off. Measure client JS on those fixtures against the release target. |

Use the [execution register](MS-002-MS-013-execution.md) for milestone status. These drafts specify inputs and tests for the next authorized implementation pass.
