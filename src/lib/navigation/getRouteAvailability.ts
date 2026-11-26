import type { Locale } from '@/i18n/config';
import { getPublishedArticles } from '@/lib/content/queries/getPublishedArticles';
import { ENV } from 'astro:env/server';

export async function getRouteAvailability(locale: Locale) {
	const preview = ENV !== 'production';
	return { preview, articles: preview || (await getPublishedArticles(locale)).length > 0 };
}
