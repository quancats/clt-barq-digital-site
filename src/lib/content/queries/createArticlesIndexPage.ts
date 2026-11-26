import { localizePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';
import { getPublishedArticles } from '@/lib/content/queries/getPublishedArticles';
import { mapArticleEntryToCard } from '@/lib/mappers/mapArticleEntryToCard';
import { getRouteAvailability } from '@/lib/navigation/getRouteAvailability';
import { createLocaleAlternates } from '@/lib/seo/createLocaleAlternates';
import { createPageSeo } from '@/lib/seo/createPageSeo';
import { createBreadcrumbListJsonLd } from '@/lib/seo/structured-data/createBreadcrumbListJsonLd';

export async function createArticlesIndexPage(options: { locale: Locale; site: URL }) {
	const { locale, site } = options;
	const dictionary = getDictionary(locale);
	const articles = (await getPublishedArticles(locale)).map(mapArticleEntryToCard);
	const canonicalPath = localizePath(locale, '/articles');
	const homePath = localizePath(locale, '/');
	const alternateLocale: Locale = locale === 'ar' ? 'en' : 'ar';
	const alternateAvailability = await getRouteAvailability(alternateLocale);
	const alternatePath = alternateAvailability.articles ? localizePath(alternateLocale, '/articles') : undefined;

	return {
		dictionary,
		articles,
		seo: createPageSeo({
			title: `${dictionary.common.articles} | ${dictionary.common.brand}`,
			description: dictionary.home.description,
			canonicalPath,
		}),
		alternates: createLocaleAlternates({
			site,
			pathsByLocale: {
				[locale]: canonicalPath,
				[alternateLocale]: alternatePath,
			},
		}),
		alternatePath,
		breadcrumbItems: [{ label: dictionary.layout.nav_home, href: homePath }, { label: dictionary.common.articles }],
		jsonLd: createBreadcrumbListJsonLd({
			site,
			items: [
				{ label: dictionary.layout.nav_home, path: homePath },
				{ label: dictionary.common.articles, path: canonicalPath },
			],
		}),
	};
}
