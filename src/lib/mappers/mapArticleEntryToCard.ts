import { localizePath, type Locale } from '@/i18n/config';
import { getArticleSlug, type ArticleEntry } from '@/lib/content/queries/getPublishedArticles';

export interface ArticleCardModel {
	id: string;
	locale: Locale;
	title: string;
	description: string;
	href: string;
	publishedAt: Date;
}

export function mapArticleEntryToCard(entry: ArticleEntry): ArticleCardModel {
	const slug = getArticleSlug(entry);

	return {
		id: entry.id,
		locale: entry.data.locale,
		title: entry.data.title,
		description: entry.data.description,
		href: localizePath(entry.data.locale, `/articles/${slug}`),
		publishedAt: entry.data.publishedAt,
	};
}
