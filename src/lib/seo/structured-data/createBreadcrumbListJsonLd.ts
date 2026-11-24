import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

export interface BreadcrumbJsonLdItem {
	label: string;
	path?: string | undefined;
}

export function createBreadcrumbListJsonLd(options: { site: URL | string; items: BreadcrumbJsonLdItem[] }): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: options.items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			...(item.path
				? {
						item: createCanonicalUrl({ site: options.site, path: item.path }).toString(),
					}
				: {}),
		})),
	};
}
