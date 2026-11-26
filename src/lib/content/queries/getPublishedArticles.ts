import { getCollection, type CollectionEntry } from 'astro:content';
import { ENV } from 'astro:env/server';
import type { Locale } from '@/i18n/config';
import { getArticleSlug, isPublicArticle } from '@/lib/content/queries/articleHelpers';
import { validateWebsiteContent } from '@/lib/content/queries/getPublishedContent';

export type ArticleEntry = CollectionEntry<'articles'>;
export { getArticleSlug, isPublicArticle };

export async function getPublishedArticles(locale?: Locale): Promise<ArticleEntry[]> {
	await validateWebsiteContent();
	// This starter collection view serves the legacy preview namespace.
	const articles = await getCollection('articles', ({ data }) => 'translationGroup' in data && isPublicArticle(data, locale, ENV));
	return articles.sort((left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf());
}

export async function getPublishedArticleBySlug(locale: Locale, slug: string): Promise<ArticleEntry | undefined> {
	const articles = await getPublishedArticles(locale);
	return articles.find((entry) => getArticleSlug(entry) === slug);
}

export async function getArticleTranslation(entry: ArticleEntry, targetLocale: Locale): Promise<ArticleEntry | undefined> {
	const articles = await getPublishedArticles(targetLocale);
	const data = entry.data;
	return articles.find(({ data: candidate }) => {
		if ('translationKey' in data && 'translationKey' in candidate) return candidate.translationKey === data.translationKey;
		if ('translationGroup' in data && 'translationGroup' in candidate) return candidate.translationGroup === data.translationGroup;
		return false;
	});
}
