# Content Ownership Map

| Route / surface       | Source                        | Freshness  | Locale model                                   | Fallback                           | Feature IDs       |
| --------------------- | ----------------------------- | ---------- | ---------------------------------------------- | ---------------------------------- | ----------------- |
| Home chrome strings   | `src/i18n/dictionaries`       | repository | mirrored dictionaries                          | build/type failure on missing keys | FEAT-PLATFORM-001 |
| Home article teaser   | Content Collection `articles` | rebuild    | separate entry per locale                      | omit drafts; empty state copy      | FEAT-CONTENT-001  |
| Articles index/detail | Content Collection `articles` | rebuild    | separate entry per locale + `translationGroup` | 404 if missing published slug      | FEAT-CONTENT-001  |
| RSS                   | Content Collection `articles` | rebuild    | mixed published entries                        | empty feed allowed                 | FEAT-CONTENT-001  |

Rules:

- No remote CMS in baseline
- Drafts excluded from public output
- Incomplete translations do not invent fallback article bodies
- Articles may be `.md` or `.mdx`; MDX may import only Astro components listed in `src/lib/content/rich-text/mdxAllowlist.ts`, enforced by `tests/integration/mdxAllowlist.test.ts`
- Prefer Markdown unless component composition is required
