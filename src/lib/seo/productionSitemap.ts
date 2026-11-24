import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { readBuild, resolvePage } from '../../../scripts/build-output.mjs';
import { isHostRedirectSource } from '../../data/hostRedirects.mjs';
import { isIndexableSitemapPage } from './isIndexableSitemapPage';

export function productionSitemap(): AstroIntegration {
	let output: Awaited<ReturnType<typeof readBuild>>;
	const integration = sitemap({
		filter(url) {
			const pathname = decodeURIComponent(new URL(url).pathname);
			const page = resolvePage(output.pages, pathname);
			return Boolean(page && !page.noindex && !page.redirect && !page.error && !isHostRedirectSource(pathname) && isIndexableSitemapPage(url));
		},
	});
	const buildSitemap = integration.hooks['astro:build:done'];
	integration.hooks['astro:build:done'] = async (options) => {
		output = await readBuild(fileURLToPath(options.dir));
		await buildSitemap?.(options);
	};
	return integration;
}
