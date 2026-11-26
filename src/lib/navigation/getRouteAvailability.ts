import type { Locale } from '@/i18n/config';
import { getArticleSlug, getPublishedArticles } from '@/lib/content/queries/getPublishedArticles';
import { ENV } from 'astro:env/server';

export async function getRouteAvailability(locale: Locale) {
	const preview = ENV !== 'production';
	const entries = await getPublishedArticles(locale);
	return { preview, articles: preview || entries.length > 0, articlePaths: entries.map((entry) => `/articles/${getArticleSlug(entry)}`) };
}
