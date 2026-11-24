# Recipe: Marketing pages and Organization JSON-LD

## Entry conditions

- Baseline routes cover home, articles, components, 404, RSS, sitemap
- Footer legal links currently use `#` placeholders and must not invent legal claims
- Baseline ships a parameterized helper with **no org data**:
    - `src/lib/seo/structured-data/createOrganizationJsonLd.ts`

## Scaffold (adopting project)

Add mirrored routes:

| Concept | ar            | en            |
| ------- | ------------- | ------------- |
| About   | `/ar/about`   | `/en/about`   |
| Contact | `/ar/contact` | `/en/contact` |
| Privacy | `/ar/privacy` | `/en/privacy` |
| Terms   | `/ar/terms`   | `/en/terms`   |

Use `WebsiteLayout` + `createPageSeo` + `createLocaleAlternates`. Update footer dictionaries to real paths only after pages exist. For personal/portfolio Person JSON-LD, see [portfolio-pages-and-person-jsonld.md](portfolio-pages-and-person-jsonld.md).

## Organization JSON-LD

Wire real, visible facts only:

```ts
import { createOrganizationJsonLd } from '@/lib/seo/structured-data/createOrganizationJsonLd';
import { createWebSiteJsonLd } from '@/lib/seo/structured-data/createWebSiteJsonLd';

const organization = createOrganizationJsonLd({
	site,
	name: SITE_NAME,
	description: orgDescription,
	path: localizePath(locale, '/'),
	logoPath: '/images/og/default.png', // or a dedicated logo asset
	sameAs: socialLinks.filter((l) => l.href.startsWith('http')).map((l) => l.href),
	// parentOrganizationName only when a real parent org is publicly claimed
});

const website = createWebSiteJsonLd({
	site,
	name: SITE_NAME,
	description: siteDescription,
	path: localizePath(locale, '/'),
});

// Home jsonLd: [website, organization]
```

Suggested config home: extend `src/data/site.ts` / `src/data/social.ts` with validation that rejects empty required fields. Do not invent address, VAT, phone, or LocalBusiness claims.

## Optional marketing section shells

Some marketing sites introduce project-local frames (`SectionFrame`, `PageHero`, `PageCanvas`). Keep those adopting-project owned when they encode brand tokens, glow/grid art, or route-specific composition. Baseline already provides `Container`, `Card`, `Heading`, `ButtonLink`, and page-owned full-bleed sections (ADR-0013).

External CTAs can use baseline `ButtonLink` `target` / `rel` props (for example `target="_blank"` + `rel="noopener noreferrer"`).

## Acceptance checks

- Reciprocal hreflang for each new page
- Sitemap includes the new routes
- `verify:links` fails if footer still points at `#` for shipped legal pages
- Organization JSON-LD appears only when configured with real data
- Structured data matches visible content (no invented LocalBusiness claims)
- `robots.txt` allows crawling only when `PUBLIC_SITE_URL` is a real production origin (baseline origin gate)

## Out of scope

- Template baseline shipping About/Legal with lorem content
- Organization JSON-LD with `example.com` placeholders presented as production claims
- Shipping brand-specific hero/section art into the shared starter
