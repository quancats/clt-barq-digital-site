# Recipe: Routing and host redirects

Barq Digital builds static HTML under `dist/` and serves the locale homes at `/ar/` and `/en/`. English is the default. The build writes `dist/_redirects` from `src/data/hostRedirects.mjs`, using `defaultLocale` from `src/i18n/config.ts`:

```text
/ /en/ 302
```

Cloudflare Workers Static Assets returns the HTTP redirect before serving HTML. Astro also generates an HTML redirect at the root for static previews. Old unprefixed Arabic URLs, such as `/about/`, use a permanent redirect to the corresponding page under `/ar/` when that page is present in the build.

## Cloudflare Workers Static Assets

The root `wrangler.jsonc` configures `clt-barq-digital-site` to serve `dist/` through Workers Static Assets. Cloudflare reads `dist/_redirects` as routing configuration during deploy.

Cloudflare Workers Builds runs `npm run build` and then `npx wrangler deploy` from the repository root. Wrangler discovers `wrangler.jsonc` and uses the output of the build step directly. The lead Worker has a separate local profile in `wrangler.local.jsonc`.

Set `ENV=production` and `PUBLIC_SITE_URL` to the deployed HTTP(S) origin for public builds. Use `ENV=staging` or `ENV=local` for previews. Preview HTML carries `noindex` and omits the sitemap. The default `PREVIEW_CRAWL_POLICY=public` lets crawlers read the directive. Use `PREVIEW_CRAWL_POLICY=private` after the host requires authentication. It additionally emits `Disallow: /`; a crawler blocked by that rule cannot read the page-level directive. Put non-public previews behind Cloudflare Access or another authenticated entry point and make sure every direct Worker/preview hostname is likewise protected or disabled. Check that an unauthenticated request cannot retrieve HTML or static assets.

## Verify locally and on the deployed host

Run `npm run build`, then `npx wrangler deploy --dry-run` to check the deploy configuration and assets. Use `npx wrangler dev --ip 127.0.0.1 --port 8787` to test redirect rules, trailing slashes, and localized 404 responses. Run the following in Node from the project root against Wrangler, then rerun with the deployed origin:

```js
import assert from 'node:assert/strict';
import { hostRedirects } from './src/data/hostRedirects.mjs';

const origin = process.env.TEST_ORIGIN ?? 'http://127.0.0.1:8787';
for (const { from, to, status } of hostRedirects) {
	const result = await fetch(new URL(from, origin), { redirect: 'manual' });
	assert.equal(result.status, status, from);
	assert.equal(new URL(result.headers.get('location'), origin).href, new URL(to, origin).href, from);
	assert.equal((await fetch(new URL(to, origin), { redirect: 'manual' })).status, 200, to);
}
for (const locale of ['ar', 'en']) {
	const response = await fetch(new URL('/' + locale + '/', origin), { redirect: 'manual' });
	assert.equal(response.status, 200, locale);
	assert.match(await response.text(), new RegExp('<html[^>]*lang="' + locale + '"'));
}
const missing = await fetch(new URL('/missing-route/', origin), { redirect: 'manual' });
assert.equal(missing.status, 404);
assert.match(await missing.text(), /<meta name="robots" content="noindex, nofollow"/);
```

Record the local Wrangler version, status and Location results. Record the live hostname and results separately, including the canonical hostname and HTTP-to-HTTPS redirect when configured.

On another static host or an artifact-only preview, configure an HTTP redirect from `/` to the generated default-locale destination. Translate the generated map into the host's routing format where it does not consume `_redirects`, then run the same HTTP checks. Adopt a host only after its root, locale pages and 404 contract pass.

## Migrate legacy routes

Add exact rules to `hostRedirects`, for example `{ from: '/ar/old-about/', to: '/ar/about/', status: 301 }`. The same map drives the build artifact and sitemap exclusions. Move any pre-existing `public/_redirects` rules into the map first. The build checks duplicate sources and refuses a target that is also a source, which rules out loops and chains. Point each rule directly to the final live route and test the old URLs without following redirects.

For each translated pair, inventory old and new paths by locale and confirm both targets are equivalent and point back through reciprocal hreflang. Export a second inventory for images, fonts, PDFs and downloadable media. Keep stable media URLs or add exact redirects and verify their content type and final status. Prefer imported images and `astro:assets` for normal content. When an old image must retain its `public/` URL, supply known dimensions, or read the file at build time to obtain its dimensions if the inventory lacks them. Keep the URL stable and emit width and height to reserve layout space.

- [Cloudflare Static Assets redirects](https://developers.cloudflare.com/workers/static-assets/redirects/)
- [Cloudflare HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Astro images](https://docs.astro.build/en/guides/images/)
