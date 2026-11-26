# MS-005 | Content collections and publication

v1.0 · REQ-005 · WP-005.1 and WP-005.2

The [MS-003 register](MS-003-route-content-register.md) remains the source of route families, editorial decisions and publication blockers. Tooling allows authors to prepare entries independently. Actual publication still requires approved material and revision-level authorization.

## Authoring

| Collection         | Additional fields                                                                      |
| ------------------ | -------------------------------------------------------------------------------------- |
| `pages`            | Localized section keys, titles and body copy                                           |
| `products`         | Product and per-feature availability, related solution keys                            |
| `services`         | Localized scope and deliverables                                                       |
| `solutions`        | Localized problem and related product, service and project keys                        |
| `industries`       | Localized needs, limitations and related solution keys                                 |
| `projects`         | Owned product, client project or case study type, role, scope and documented results   |
| `articles`, `news` | Markdown body, publication and update dates, category, tags and optional author key    |
| `resources`        | Publication date, type, category, public PDF path, localized label and usage reference |
| `authors`          | Localized biography, when an editorial entry uses an author key                        |
| `legal`            | Revision key and effective date                                                        |

Put entries in `src/content/<collection>/`. Articles use Markdown, with trusted MDX available under the existing allowlist. Other collections accept Markdown, one record per JSON file or one record per YAML file. Empty collections deliberately contain no editorial scaffolds. Astro warns when those collections have no files.

Every locale variant has a globally unique `contentId`, a `translationKey` shared across the actual translation pair, `locale`, a localized route `slug`, title, description and explicit `governance.status`. Use meaningful, stable identifiers. Optional fields cover ordering, feature flags, SEO overrides and a list of local imagery. Every media reference includes localized alternative text and an opaque `usageRef`. Keep permission documents and non-public assets in the authorized store. The site copies all files under `public/` into the artifact. Add files to that tree only after clearance.

## Publication checks

- Only entries marked `published` with an `approvalRef` appear in published-content queries. Keep the approval itself in the authorized source of record. `draft`, `review` and `archived` entries are excluded.
- The validation call from the article query checks all collections during static generation. It rejects duplicate IDs globally, duplicate slugs and translation keys within a collection and locale, and published references without an approved target in the source locale.
- A published item in pages, products, services, solutions and legal requires approved counterparts in Arabic and English. Other collections may publish one approved locale. Route consumers receive only actual approved localized slugs, and article alternates follow only matching translation keys.
- Asset schema checks constrain public references to local raster image and PDF paths, and require alt text or labels and an asset permission reference. Build validation checks files referenced by published entries. Assets referenced only by non-public entries trigger a build error when the files exist in the public tree.
- Approved articles use the localized `/insights/articles/` namespace. Starter articles retain their local preview IDs and routes under `/articles/`. Starter articles are excluded in staging and production, and their drafts stay hidden. Set `ENV=production` for a production artifact and `ENV=staging` for a shared staging artifact.
- Each file in `public/downloads/` needs a reference from an approved resource or approved page profile. The build checks the PDF signature and any declared byte size. A resource record's locale must match its PDF language.

## Engineering handoff

Use `getPublishedContent(collection, locale)` for approved inputs to future route templates. Use the localized publication route map for translation availability. Store route-family prefixes in the locale route contract. A schema check verifies structure and references, while owners verify the authority and scope of each approval.

Focused tests cover positive paired entries, locale and key uniqueness, missing approved translations, invalid references, draft and starter filtering, missing files and unsafe media metadata. The local article and MDX compatibility suites are exercised alongside the publication suite.
