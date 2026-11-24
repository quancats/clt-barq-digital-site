import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

export interface PersonJsonLdInput {
	/** Stable absolute `@id`, e.g. `https://example.com/#person`. */
	id: string;
	url: string;
	name: string;
	jobTitle?: string;
	description?: string;
	image?: string;
	email?: string | readonly string[];
	telephone?: string;
	sameAs?: readonly string[];
	homeLocation?: { name: string };
	worksFor?: { name: string; url?: string };
	alternateName?: string | readonly string[];
}

/**
 * Parameterized Person JSON-LD. Pass typed data only — never hard-code identity in this module.
 * Omit optional PII unless approved and visible on the page.
 */
export function createPersonJsonLd(input: PersonJsonLdInput): Record<string, unknown> {
	const jsonLd: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': input.id,
		url: input.url,
		name: input.name,
	};

	if (input.jobTitle) jsonLd.jobTitle = input.jobTitle;
	if (input.description) jsonLd.description = input.description;
	if (input.image) jsonLd.image = input.image;
	if (input.email) jsonLd.email = Array.isArray(input.email) ? [...input.email] : input.email;
	if (input.telephone) jsonLd.telephone = input.telephone;
	if (input.sameAs?.length) jsonLd.sameAs = [...input.sameAs];
	if (input.alternateName) {
		jsonLd.alternateName = Array.isArray(input.alternateName) ? [...input.alternateName] : input.alternateName;
	}
	if (input.homeLocation) {
		jsonLd.homeLocation = { '@type': 'Place', name: input.homeLocation.name };
	}
	if (input.worksFor) {
		jsonLd.worksFor = {
			'@type': 'Organization',
			name: input.worksFor.name,
			...(input.worksFor.url ? { url: input.worksFor.url } : {}),
		};
	}

	return jsonLd;
}

/** Builds a stable Person `@id` reference for linking from WebSite publisher/author. */
export function createPersonIdRef(site: URL | string, fragment = 'person'): { '@id': string } {
	const origin = typeof site === 'string' ? new URL(site) : site;
	const id = createCanonicalUrl({ site: origin, path: '/' }).toString().replace(/\/$/, '') + `/#${fragment}`;
	return { '@id': id };
}
