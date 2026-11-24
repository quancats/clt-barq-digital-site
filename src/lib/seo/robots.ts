import { FALLBACK_SITE_URL } from '@/lib/env/resolveSiteUrl';

/**
 * Builds `robots.txt` body. Public previews let crawlers read the page-level noindex directive.
 */
export function createRobotsTxt(options: { origin: string | URL; indexable: boolean; privatePreview?: boolean }): string {
	const origin = typeof options.origin === 'string' ? new URL(options.origin) : options.origin;
	const sitemapURL = new URL('sitemap-index.xml', origin);

	if (!options.indexable) {
		return `User-agent: *
${options.privatePreview ? 'Disallow: /' : 'Allow: /'}

# Non-production environment: set ENV=production and PUBLIC_SITE_URL to the public origin before a real deploy (not ${FALLBACK_SITE_URL}).
`;
	}

	return `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;
}
