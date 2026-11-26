import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { isHostRedirectSource, renderHostRedirects } from '../src/data/hostRedirects.mjs';
import { readBuild } from './build-output.mjs';

const directory = path.resolve('dist');
const { assets, pages } = await readBuild(directory);
const expectedMode = process.argv[2];
if (expectedMode && !['preview', 'private-preview', 'production'].includes(expectedMode)) throw new Error('Usage: pnpm run verify:seo [preview|private-preview|production]');
const robots = await readFile(path.join(directory, 'robots.txt'), 'utf8');
const production = expectedMode ? expectedMode === 'production' : assets.has('/sitemap-index.xml');
const privatePreview = expectedMode === 'private-preview' || (!expectedMode && process.env.PREVIEW_CRAWL_POLICY === 'private');
const failures = [];
const check = (condition, message) => {
	if (!condition) failures.push(message);
};
const origin = process.env.PUBLIC_SITE_URL ? new URL(process.env.PUBLIC_SITE_URL).origin : URL.parse(robots.match(/^Sitemap:\s*(\S+)/m)?.[1] ?? '')?.origin;
const sitemapFiles = [...assets].filter((file) => /^\/sitemap[^/]*\.xml$/.test(file));
const references = async (file) => [...(await readFile(path.join(directory, file.slice(1)), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc.replaceAll('&amp;', '&'));
const sitemapUrls = new Set();

const allowsCrawling = /^Allow: \/$/m.test(robots) && !/^Disallow:\s*\S/m.test(robots);

if (production) {
	check(origin && robots.includes('Sitemap: ' + origin + '/sitemap-index.xml') && allowsCrawling, 'robots.txt must advertise the production sitemap');
	check(sitemapFiles.includes('/sitemap-index.xml'), 'missing sitemap-index.xml');
	if (sitemapFiles.includes('/sitemap-index.xml')) {
		const listed = await references('/sitemap-index.xml');
		check(listed.length > 0, 'empty sitemap index');
		for (const url of listed) {
			const chunk = new URL(url);
			if (chunk.origin !== origin || chunk.pathname === '/sitemap-index.xml' || !sitemapFiles.includes(chunk.pathname)) {
				failures.push('invalid sitemap chunk ' + url);
				continue;
			}
			for (const entry of await references(chunk.pathname)) {
				check(!sitemapUrls.has(entry), 'duplicate sitemap URL ' + entry);
				sitemapUrls.add(entry);
			}
		}
	}
} else {
	check(!sitemapFiles.length && !/^Sitemap:/im.test(robots) && (privatePreview ? /^Disallow: \/$/m.test(robots) && !/^Allow:/m.test(robots) : allowsCrawling), 'preview robots policy or sitemap mismatch');
}

check(pages.size > 0, 'missing HTML pages');
check(pages.has('/'), 'Arabic home must be rendered at the root');
check(assets.has('/_redirects') && (await readFile(path.join(directory, '_redirects'), 'utf8')) === renderHostRedirects(), 'missing or outdated Cloudflare redirect rules');
for (const [route, page] of pages) {
	const excluded = page.noindex || page.error || page.redirect || isHostRedirectSource(route);
	const links = page.elements.filter(({ name }) => name === 'link').map(({ attributes }) => attributes);
	check(links.some(({ rel, href }) => rel === 'sitemap' && href === '/sitemap-index.xml') === (production && !excluded), route + ' sitemap advertisement mismatch');
	if (page.redirect) continue;
	if (!production) check(page.noindex, route + ' must use noindex in preview');
	if (excluded || !production) continue;

	const canonicals = links.filter(({ rel }) => rel === 'canonical');
	const expected = origin && new URL(route, origin).href;
	check(canonicals.length === 1 && canonicals[0].href === expected && route.endsWith('/'), route + ' has an incorrect canonical');
	check(sitemapUrls.delete(expected), route + ' missing from sitemap');
	const locale = page.elements.find(({ name }) => name === 'html')?.attributes.lang;
	const alternates = links.filter(({ rel, hreflang }) => rel === 'alternate' && hreflang);
	const languages = new Set();
	check(!alternates.length || alternates.some(({ href, hreflang }) => hreflang === locale && href === expected), route + ' missing hreflang self reference');
	for (const { href, hreflang } of alternates) {
		const url = URL.parse(href);
		const equivalent = url && pages.get(decodeURIComponent(url.pathname));
		check(!languages.has(hreflang), route + ' duplicate hreflang ' + hreflang);
		languages.add(hreflang);
		check(url?.origin === origin && url?.pathname.endsWith('/') && equivalent && !equivalent.redirect && !equivalent.error, route + ' invalid hreflang destination ' + href);
		if (hreflang === 'x-default' || !equivalent) continue;
		check(
			equivalent.elements.some(({ name, attributes }) => name === 'html' && attributes.lang === hreflang),
			route + ' hreflang locale mismatch ' + href,
		);
		check(
			equivalent.elements.some(({ name, attributes }) => name === 'link' && attributes.rel === 'alternate' && attributes.hreflang === locale && attributes.href === expected),
			route + ' missing reciprocal hreflang from ' + href,
		);
	}
}
for (const url of sitemapUrls) failures.push('unexpected sitemap URL ' + url);
if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ mode: production ? 'production' : privatePreview ? 'private-preview' : 'preview', checkedHtmlFiles: pages.size, sitemapFiles: sitemapFiles.length }));
