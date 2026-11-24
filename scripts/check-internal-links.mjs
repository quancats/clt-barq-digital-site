import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readBuild, resolvePage } from './build-output.mjs';

export async function checkInternalLinks(directory, { origin, checkIsolated = false } = {}) {
	const { assets, pages } = await readBuild(directory);
	if (!pages.size) throw new Error('No HTML files found. Run a build first.');
	const canonical = [...pages.values()].flatMap(({ elements }) => elements).find(({ name, attributes }) => name === 'link' && attributes.rel === 'canonical');
	const site = new URL(origin ?? canonical?.attributes.href ?? 'https://example.com').origin;
	const incoming = new Set();
	const broken = [];
	for (const [pathname, source] of pages) {
		const sourceUrl = new URL(pathname, site);
		const base = source.elements.find(({ name, attributes }) => name === 'base' && attributes.href);
		const baseUrl = base ? new URL(base.attributes.href, sourceUrl) : sourceUrl;
		for (const { name, attributes } of source.elements) {
			const href = attributes.href;
			if (!href || name === 'base') continue;
			try {
				const target = new URL(href, baseUrl);
				if (target.origin !== site || !['http:', 'https:'].includes(target.protocol)) continue;
				const targetPath = decodeURIComponent(target.pathname);
				const page = resolvePage(pages, targetPath);
				if (!page && !assets.has(targetPath)) throw new Error('missing destination');
				const fragment = decodeURIComponent(target.hash.slice(1)).split(':~:')[0];
				if (page && fragment && fragment.toLowerCase() !== 'top' && !page.ids.has(fragment)) throw new Error('missing fragment');
				if (page && page !== source && ['a', 'area'].includes(name)) incoming.add(page);
			} catch (error) {
				broken.push({ from: pathname, href, reason: error.message });
			}
		}
	}
	const isolated = checkIsolated ? [...pages].filter(([url, page]) => url !== '/' && !page.error && !page.redirect && !incoming.has(page)).map(([url]) => url) : [];
	return { checkedHtmlFiles: pages.size, brokenInternalLinks: broken, isolatedPages: isolated };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		const result = await checkInternalLinks(path.resolve('dist'), { origin: process.env.PUBLIC_SITE_URL, checkIsolated: process.argv.includes('--check-isolated') });
		console.log(JSON.stringify(result, null, 2));
		if (result.brokenInternalLinks.length || result.isolatedPages.length) process.exitCode = 1;
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}
