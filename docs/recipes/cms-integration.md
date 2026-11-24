# Recipe: CMS integration

## Baseline

- Local Content Collections under `src/content/**`
- Markdown + allowlisted MDX
- No CMS SDKs (`DEPENDENCY-REGISTER`)

## Preferred progression

1. Keep editing local Markdown/MDX until non-technical ownership is required
2. Prefer **build-time** CMS → static HTML (webhook triggers CI rebuild)
3. Add a CMS SDK only after:
    - Feature ID + content ownership docs
    - API contract / auth model
    - Preview/draft strategy
    - Dependency proposal

## Suggested adopting-project docs

- `docs/system/CONTENT-OWNERSHIP.md` (or product equivalent)
- `docs/system/API-CONTRACTS.md` for remote loaders
- `docs/system/DATA-OWNERSHIP.md` if a database is involved

## Acceptance checks

- Draft/published rules remain explicit
- Sitemap/RSS exclude non-public entries
- Locale/`translationGroup` mapping stays reciprocal for hreflang
- Rebuild latency and failure alerts are owned by ops

## Out of scope

- Shipping Sanity/Contentful/Filament clients in the shared starter
- Runtime fetches for every page view when build-time generation is enough

## Build-time fixture and API example

Keep the same public content shape for both sources. Create one loader per build. A shared Promise cache deduplicates concurrent requests for a locale, and a rejected response is evicted. The browser receives only generated HTML. Provider credentials belong in the build environment.

```js
const fixtures = {
	ar: { locale: 'ar', title: 'مرحبًا', translationGroup: 'home' },
	en: { locale: 'en', title: 'Welcome', translationGroup: 'home' },
};

export function createHomeLoader({ apiOrigin, fetchPage = fetch } = {}) {
	const cache = new Map();
	async function read(locale) {
		let page = fixtures[locale];
		if (apiOrigin) {
			const response = await fetchPage(new URL('/public/home/' + locale, apiOrigin));
			if (!response.ok) throw new Error('CMS ' + locale + ' returned HTTP ' + response.status);
			page = await response.json();
		}
		if (page?.locale !== locale || typeof page.title !== 'string' || !page.title.trim() || page.translationGroup !== 'home') {
			throw new Error('Invalid public home content for ' + locale);
		}
		return page;
	}
	return (locale) => {
		if (locale !== 'ar' && locale !== 'en') throw new Error('Unsupported CMS locale ' + locale);
		if (!cache.has(locale)) {
			cache.set(
				locale,
				read(locale).catch((error) => {
					cache.delete(locale);
					throw error;
				}),
			);
		}
		return cache.get(locale);
	};
}
```

Copy the module into the adopting project's server-side content layer, create a singleton loader with the build-time endpoint, and await it from each locale's Astro frontmatter. A missing required entry, malformed record, or non-2xx response fails prerendering. Fixture mode is explicit through omitted API configuration, and an API failure never switches the build to fixture data. Verify both locale pages, inject a failed response and an invalid record, and confirm the build fails before producing a deployable artifact. Keep product schemas, SSR services and deployment configuration in the adopting repository.

## Adoption ownership

Record the CMS service owner, content destinations and service-account scopes. Restrict draft preview access, use a separate preview cache, and authenticate rebuild webhooks before accepting a trigger. Verify invalid webhook requests and draft isolation with test fixtures. Record live provider acceptance in the adopting project.
