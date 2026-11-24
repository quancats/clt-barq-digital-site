import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';

export function createArticleJsonLd(options: { site: URL | string; path: string; title: string; description: string; publishedAt: Date; updatedAt?: Date | undefined; image?: string | undefined; locale: string }): Record<string, unknown> {
	const url = createCanonicalUrl({ site: options.site, path: options.path }).toString();
	const image = options.image ? createCanonicalUrl({ site: options.site, path: options.image }).toString() : undefined;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: options.title,
		description: options.description,
		url,
		inLanguage: options.locale,
		datePublished: options.publishedAt.toISOString(),
		...(options.updatedAt ? { dateModified: options.updatedAt.toISOString() } : { dateModified: options.publishedAt.toISOString() }),
		...(image ? { image: [image] } : {}),
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url,
		},
	};
}
