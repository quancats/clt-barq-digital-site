import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { defaultLocale, localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';
import { getArticleSlug, getPublishedArticles } from '@/lib/content/queries/getPublishedArticles';
import { FALLBACK_SITE_URL } from '@/lib/env/resolveSiteUrl';

export const GET: APIRoute = async (context) => {
	const site = context.site ?? new URL(FALLBACK_SITE_URL);
	const articles = await getPublishedArticles();
	const dictionary = getDictionary(defaultLocale);

	return rss({
		title: dictionary.common.brand,
		description: dictionary.common.rss_description,
		site,
		items: articles.map((entry) => ({
			title: entry.data.title,
			description: entry.data.description,
			pubDate: entry.data.publishedAt,
			link: localizePath(entry.data.locale, `/articles/${getArticleSlug(entry)}`),
		})),
	});
};
