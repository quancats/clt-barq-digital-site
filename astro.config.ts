// @ts-check
import { rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import { renderHostRedirects } from './src/data/hostRedirects.mjs';
import { previewAssets } from './src/data/previewAssets';
import { defaultLocale, localizePath, locales } from './src/i18n/config';
import { resolveSiteUrl } from './src/lib/env/resolveSiteUrl';
import { isSiteIndexable } from './src/lib/seo/indexingPolicy';
import { productionSitemap } from './src/lib/seo/productionSitemap';
import { readBuild } from './scripts/build-output.mjs';
import { bundleHomeStyles } from './scripts/bundle-home-styles.mjs';

// Astro evaluates this file before normal Vite `.env` injection; load file env explicitly.
const fileEnv = loadEnv(process.env.NODE_ENV === 'production' ? 'production' : 'development', process.cwd(), '');
const site = resolveSiteUrl({
	processPublicSiteUrl: process.env.PUBLIC_SITE_URL,
	filePublicSiteUrl: fileEnv.PUBLIC_SITE_URL,
});
const configuredEnv = (process.env.ENV ?? fileEnv.ENV ?? 'local').trim();
const configuredOrigin = process.env.PUBLIC_SITE_URL?.trim() || fileEnv.PUBLIC_SITE_URL || '';
const indexable = isSiteIndexable(configuredEnv, configuredOrigin);
const catalogOnlySources = ['../components/islands/interactive/ComponentCatalog.vue', '../components/astro/sections/components', '../pages/design-preview', '../components/ui/{accordion,alert,alert-dialog,aspect-ratio,avatar,badge,card,carousel,checkbox,combobox,empty,field,form,input,input-group,item,label,native-select,number-field,pagination,progress,radio-group,separator,skeleton,sonner,spinner,stepper,switch,tabs,textarea,tooltip}'];

export default defineConfig({
	output: 'static',
	site,
	trailingSlash: 'always',
	build: {
		// Directory layout (`dist/about/index.html`). Public URLs keep a trailing slash (`/about/`).
		// Hosts should serve `/about/` from `/about/index.html` and redirect `/about` → `/about/` (ADR-0016).
		format: 'directory',
	},
	env: {
		schema: {
			/**
			 * Project work environment (not Vite `--mode`).
			 * Use to gate production-only behavior (indexing, analytics eligibility helpers, etc.).
			 */
			ENV: envField.enum({
				context: 'server',
				access: 'public',
				values: ['local', 'staging', 'production'],
				default: 'local',
			}),
			/** Absolute public origin; also drives Astro `site` via `resolveSiteUrl` + `loadEnv`. */
			PREVIEW_CRAWL_POLICY: envField.enum({
				context: 'server',
				access: 'public',
				values: ['public', 'private'],
				default: 'public',
			}),
			PUBLIC_SITE_URL: envField.string({
				context: 'server',
				access: 'public',
				url: true,
				default: 'https://example.com',
			}),
			PUBLIC_DEFAULT_THEME: envField.enum({
				context: 'client',
				access: 'public',
				values: ['light', 'dark', 'auto'],
				default: 'auto',
			}),
			PUBLIC_GOOGLE_ANALYTICS_ID: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
			}),
			PUBLIC_GOOGLE_ANALYTICS_ENABLED: envField.boolean({
				context: 'client',
				access: 'public',
				default: true,
			}),
			PUBLIC_GOOGLE_ANALYTICS_MODE: envField.enum({
				context: 'client',
				access: 'public',
				values: ['off', 'opt-out', 'opt-in'],
				default: 'opt-in',
			}),
		},
	},
	i18n: {
		locales: [...locales],
		defaultLocale,
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: false,
		},
	},
	redirects: { '/': { destination: localizePath(defaultLocale), status: 302 } },
	prefetch: {
		prefetchAll: false,
		defaultStrategy: 'viewport',
	},
	devToolbar: {
		enabled: true,
	},
	integrations: [
		{
			name: 'template-indexing-policy',
			hooks: {
				'astro:config:setup': ({ command }) => {
					if (command === 'build' && configuredEnv === 'production' && !indexable) {
						throw new Error('ENV=production requires PUBLIC_SITE_URL to be a public HTTP(S) origin without a path, query, or fragment.');
					}
				},
			},
		},
		...(indexable ? [productionSitemap()] : []),
		{
			name: 'cloudflare-static-redirects',
			hooks: {
				'astro:build:done': async ({ dir }) => {
					// Workers Static Assets uses the closest 404.html when 404-page handling is enabled.
					await Promise.all(locales.map((locale) => rename(new URL(`${locale}/404/index.html`, dir), new URL(`${locale}/404.html`, dir))));
					const { pages } = await readBuild(fileURLToPath(dir));
					await writeFile(new URL('_redirects', dir), renderHostRedirects([...pages].filter(([, page]) => !page.error && !page.redirect).map(([path]) => path)), { flag: 'wx' });
					if (configuredEnv === 'production') {
						await bundleHomeStyles(dir, locales);
						await Promise.all(previewAssets.map((path) => rm(new URL(path.slice(1), dir), { force: true })));
					}
				},
			},
		},
		mdx({
			// Keep MDX aligned with Markdown processing defaults unless a project override is approved.
			extendMarkdownConfig: true,
		}),
		vue(),
		icon({
			// Canonical local SVG directory (overrides default `src/icons/`).
			iconDir: 'src/assets/icons',
		}),
	],
	vite: {
		plugins: [
			{
				name: 'barq-public-tailwind-sources',
				enforce: 'pre',
				transform(css, id) {
					if (configuredEnv !== 'production' || !id.endsWith('/src/styles/global.css')) return;
					// These components are used by the design previews, which are removed from the public build.
					return `${css}\n${catalogOnlySources.map((source) => `@source not '${source}';`).join('\n')}`;
				},
			},
			tailwindcss(),
		],
	},
});
