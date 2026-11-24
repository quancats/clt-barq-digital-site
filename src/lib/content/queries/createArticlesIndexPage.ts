import { localizePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';
import { getPublishedArticles } from '@/lib/content/queries/getPublishedArticles';
import { mapArticleEntryToCard } from '@/lib/mappers/mapArticleEntryToCard';
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
				ar: localizePath('ar', '/articles'),
				en: localizePath('en', '/articles'),
			},
		}),
		alternatePath: localizePath(alternateLocale, '/articles'),
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
