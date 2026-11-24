import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/config';
import { getArticleSlug, isPublicArticle } from '@/lib/content/queries/articleHelpers';

export type ArticleEntry = CollectionEntry<'articles'>;
export { getArticleSlug, isPublicArticle };

export async function getPublishedArticles(locale?: Locale): Promise<ArticleEntry[]> {
	const articles = await getCollection('articles', ({ data }) => isPublicArticle(data, locale));

	return articles.sort((left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf());
}

export async function getPublishedArticleBySlug(locale: Locale, slug: string): Promise<ArticleEntry | undefined> {
	const articles = await getPublishedArticles(locale);
	return articles.find((entry) => entry.id.endsWith(`/${slug}`) || entry.id === slug);
}

export async function getArticleTranslation(entry: ArticleEntry, targetLocale: Locale): Promise<ArticleEntry | undefined> {
	const articles = await getPublishedArticles(targetLocale);
	return articles.find((candidate) => candidate.data.translationGroup === entry.data.translationGroup);
}
