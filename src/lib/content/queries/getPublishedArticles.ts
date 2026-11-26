import { getCollection, type CollectionEntry } from 'astro:content';
import { ENV } from 'astro:env/server';
import type { Locale } from '@/i18n/config';
import { getArticleSlug, isPublicArticle } from '@/lib/content/queries/articleHelpers';
import { validateWebsiteContent } from '@/lib/content/queries/getPublishedContent';

export type ArticleEntry = CollectionEntry<'articles'>;
export { getArticleSlug, isPublicArticle };

export async function getPublishedArticles(locale?: Locale): Promise<ArticleEntry[]> {
	await validateWebsiteContent();
	const articles = await getCollection('articles', ({ data }) => isPublicArticle(data, locale, ENV));
	const approvedRoutes = new Set(articles.filter(({ data }) => 'governance' in data).map((entry) => `${entry.data.locale}/${getArticleSlug(entry)}`));

	return articles.filter((entry) => 'governance' in entry.data || !approvedRoutes.has(`${entry.data.locale}/${getArticleSlug(entry)}`)).sort((left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf());
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
