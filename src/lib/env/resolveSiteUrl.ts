const DEFAULT_SITE_URL = 'https://example.com';

export interface ResolveSiteUrlSources {
	/** Process env `PUBLIC_SITE_URL` (highest precedence). */
	processPublicSiteUrl?: string | undefined;
	/** File `.env*` `PUBLIC_SITE_URL`. */
	filePublicSiteUrl?: string | undefined;
}

/**
 * Resolves the absolute site origin for Astro `site`, canonical URLs, sitemap, and RSS.
 * Production deploys must set `PUBLIC_SITE_URL` to the real public origin (not example.com).
 *
 * Precedence (first non-empty wins):
 * 1. process `PUBLIC_SITE_URL`
 * 2. file `PUBLIC_SITE_URL` (from Vite `loadEnv` during `astro.config.ts` evaluation)
 *
 * Callers that need `.env` file values during config evaluation should pass file fields from
 * Vite `loadEnv` (Astro evaluates config before normal Vite env injection).
 */
export function resolveSiteUrl(rawOrSources?: string | ResolveSiteUrlSources): string {
	if (typeof rawOrSources === 'string' || rawOrSources === undefined) {
		return normalizeOrigin(rawOrSources);
	}

	const selected = rawOrSources.processPublicSiteUrl?.trim() ? rawOrSources.processPublicSiteUrl : rawOrSources.filePublicSiteUrl;
	return normalizeOrigin(selected);
}

function normalizeOrigin(raw: string | undefined): string {
	const value = raw?.trim().replace(/^['"]|['"]$/g, '');

	if (!value) {
		warnDuringBuild(`PUBLIC_SITE_URL is unset; falling back to ${DEFAULT_SITE_URL}. Set PUBLIC_SITE_URL for real deployments.`);
		return DEFAULT_SITE_URL;
	}

	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`PUBLIC_SITE_URL must be an absolute URL (http or https). Received: ${value}`);
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new Error(`PUBLIC_SITE_URL must use http or https. Received: ${value}`);
	}

	if (url.origin === DEFAULT_SITE_URL) {
		warnDuringBuild('PUBLIC_SITE_URL is https://example.com. Replace it with the production origin before a real deploy.');
	}

	return url.origin;
}

function warnDuringBuild(message: string): void {
	if (process.argv.includes('build')) {
		console.warn(`[astro.config] ${message}`);
	}
}

export const FALLBACK_SITE_URL = DEFAULT_SITE_URL;
