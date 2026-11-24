import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

export function createWebSiteJsonLd(options: {
	site: URL | string;
	name: string;
	description: string;
	path?: string;
	/** When true, set publisher/author to the Person `@id` fragment (portfolio sites). */
	linkPerson?: boolean;
	personFragment?: string;
}): Record<string, unknown> {
	const url = createCanonicalUrl({
		site: options.site,
		path: options.path ?? '/',
	}).toString();

	const jsonLd: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: options.name,
		description: options.description,
		url,
	};

	if (options.linkPerson) {
		const origin = typeof options.site === 'string' ? new URL(options.site) : options.site;
		const fragment = options.personFragment ?? 'person';
		const personId = createCanonicalUrl({ site: origin, path: '/' }).toString().replace(/\/$/, '') + `/#${fragment}`;
		const ref = { '@id': personId };
		jsonLd.publisher = ref;
		jsonLd.author = ref;
	}

	return jsonLd;
}
