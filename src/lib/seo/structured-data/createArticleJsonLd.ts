import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

export function createArticleJsonLd(options: { site: URL | string; path: string; title: string; description: string; publishedAt?: Date | undefined; updatedAt?: Date | undefined; image?: string | undefined; locale: string }): Record<string, unknown> {
	const url = createCanonicalUrl({ site: options.site, path: options.path }).toString();
	const image = options.image ? createCanonicalUrl({ site: options.site, path: options.image }).toString() : undefined;
	const modified = options.updatedAt ?? options.publishedAt;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: options.title,
		description: options.description,
		url,
		inLanguage: options.locale,
		...(options.publishedAt && { datePublished: options.publishedAt.toISOString() }),
		...(modified && { dateModified: modified.toISOString() }),
		...(image ? { image: [image] } : {}),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url,
		},
	};
}
