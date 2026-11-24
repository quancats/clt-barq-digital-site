import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

/**
 * Parameterized Organization JSON-LD. Pass only real, publicly visible facts.
 * Do not invent address, VAT, phone, or parent claims.
 */
export function createOrganizationJsonLd(options: { site: URL | string; name: string; description: string; path?: string; parentOrganizationName?: string; logoPath?: string; sameAs?: readonly string[] }): Record<string, unknown> {
	const jsonLd: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: options.name,
		description: options.description,
		url: createCanonicalUrl({
			site: options.site,
			path: options.path ?? '/',
		}).toString(),
	};

	if (options.logoPath) {
		jsonLd.logo = createCanonicalUrl({
			site: options.site,
			path: options.logoPath,
		}).toString();
	}

	if (options.sameAs && options.sameAs.length > 0) {
		jsonLd.sameAs = [...options.sameAs];
	}

	if (options.parentOrganizationName) {
		jsonLd.parentOrganization = {
			'@type': 'Organization',
			name: options.parentOrganizationName,
		};
	}

	return jsonLd;
}
