# Recipe: Portfolio pages and Person JSON-LD

## Entry conditions

- The adopting site is a personal/portfolio profile (not an Organization-first marketing site).
- Baseline ships parameterized helpers (no personal data):
    - `src/lib/seo/structured-data/createPersonJsonLd.ts`
    - optional `linkPerson` on `createWebSiteJsonLd`
- Baseline already supports rendering one or more JSON-LD objects via `StructuredData.astro`.

## Goals

- Reuse the template query-factory pattern (`createPageSeo`, locale alternates, dictionaries).
- Pass Person data as typed arguments — never hard-code personal identity inside helpers.
- Keep email, telephone, address, and `sameAs` optional and publicly approved only.

## Suggested layout

```text
src/data/person.ts
src/lib/content/queries/createAboutPage.ts   # example
src/pages/{ar,en}/about/index.astro
src/components/astro/profile/ProfileSection.astro   # optional shell
src/components/astro/profile/TimelineList.astro     # optional
tests/unit/structuredData.test.ts
```

## Wire Person + WebSite

```ts
import { createPersonJsonLd, createPersonIdRef } from '@/lib/seo/structured-data/createPersonJsonLd';
import { createWebSiteJsonLd } from '@/lib/seo/structured-data/createWebSiteJsonLd';

const person = createPersonJsonLd({
	id: createPersonIdRef(site)['@id'],
	url: canonicalHome,
	name: personData.name[locale],
	jobTitle: personData.jobTitle?.[locale],
	description: personData.description[locale],
	sameAs: personData.sameAs, // validated public profile URLs only
	// email / telephone / homeLocation / worksFor only when approved + visible
});

const website = createWebSiteJsonLd({
	site,
	name: siteName,
	description: siteDescription,
	path: localizePath(locale, '/'),
	linkPerson: true,
});

// Home jsonLd: [website, person]
```

## Optional profile UI shells (not shipped in baseline)

Portfolio sites often add thin composition helpers. Keep them project-owned because visuals diverge:

| Shell                          | Role                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `ProfileSection.astro`         | `<section>` + heading + column width                                            |
| `TimelineList.astro`           | Experience/education list (dates, optional logos, optional collapsible details) |
| `profileUi.ts` / `profile.css` | Brand-specific Tailwind fragments — do not copy another client's look           |

Prefer semantic HTML + existing `Container` / `Heading` / `Badge` over inventing a second design system.

## Page factory guidance

- Pair `ar` / `en` routes with reciprocal hreflang and `x-default`.
- Prefer `defaultLocale` from config over hard-coding `ar`.
- Keep return types page-specific; do not invent one mega “any page” type.
- Avoid `Partial<Record<Locale, string>>` for required copy — missing locales should fail typecheck/tests.

## Acceptance checks

- Person JSON-LD matches visible content in both locales
- Optional PII fields omit when unset
- Stable `@id` / canonical `url`
- When `linkPerson` is used, WebSite `publisher`/`author` reference the same `@id`
- Unit tests cover omission and locale names
- E2E asserts about/profile routes and structured-data script presence when claimed

## Out of scope for the shared template

- Shipping a real person’s biography, contact details, or brand styling as baseline
- Replacing Organization JSON-LD guidance for company sites (see marketing/org recipe)
- Copying another project's TimelineList visual language as the starter default
