import { defaultLocale, localizePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';
import { getPublishedArticles } from '@/lib/content/queries/getPublishedArticles';
import { mapArticleEntryToCard } from '@/lib/mappers/mapArticleEntryToCard';
import { createLocaleAlternates } from '@/lib/seo/createLocaleAlternates';
import { createPageSeo } from '@/lib/seo/createPageSeo';
import { createWebSiteJsonLd } from '@/lib/seo/structured-data/createWebSiteJsonLd';

export async function createHomePage(options: { locale: Locale; site: URL }) {
	const { locale, site } = options;
	const dictionary = getDictionary(locale);
	const articles = (await getPublishedArticles(locale)).slice(0, 3).map(mapArticleEntryToCard);
	const canonicalPath = localizePath(locale, '/');
	const alternateLocale = locale === 'ar' ? 'en' : 'ar';

	return {
		dictionary,
		articles,
		seo: createPageSeo({
			title: `${dictionary.home.title} | ${dictionary.common.brand}`,
			description: dictionary.home.description,
			canonicalPath,
			type: 'website',
		}),
		alternates: createLocaleAlternates({
			site,
			pathsByLocale: {
				ar: localizePath('ar', '/'),
				en: localizePath('en', '/'),
			},
			includeXDefault: true,
			xDefaultPath: localizePath(defaultLocale),
		}),
		alternatePath: localizePath(alternateLocale, '/'),
		jsonLd: createWebSiteJsonLd({
			site,
			name: dictionary.common.brand,
			description: dictionary.home.description,
			path: canonicalPath,
		}),
	};
}
