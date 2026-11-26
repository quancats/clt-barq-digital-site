import { localizePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';
import { getArticleSlug, getArticleTranslation, type ArticleEntry } from '@/lib/content/queries/getPublishedArticles';
import { createLocaleAlternates } from '@/lib/seo/createLocaleAlternates';
import { createPageSeo } from '@/lib/seo/createPageSeo';
import { createArticleJsonLd } from '@/lib/seo/structured-data/createArticleJsonLd';
import { createBreadcrumbListJsonLd } from '@/lib/seo/structured-data/createBreadcrumbListJsonLd';

export async function createArticlePage(options: { locale: Locale; site: URL; entry: ArticleEntry }) {
	const { locale, site, entry } = options;
	const dictionary = getDictionary(locale);
	const alternateLocale: Locale = locale === 'ar' ? 'en' : 'ar';
	const slug = getArticleSlug(entry);
	const translation = await getArticleTranslation(entry, alternateLocale);
	const canonicalPath = localizePath(locale, `/articles/${slug}`);
	const homePath = localizePath(locale, '/');
	const articlesPath = localizePath(locale, '/articles');
	const alternatePath = translation ? localizePath(alternateLocale, `/articles/${getArticleSlug(translation)}`) : undefined;
	const image = 'media' in entry.data ? entry.data.media[0]?.path : entry.data.image;

	const breadcrumbItems = [{ label: dictionary.layout.nav_home, href: homePath }, { label: dictionary.common.articles, href: articlesPath }, { label: entry.data.title }];

	return {
		dictionary,
		slug,
		canonicalPath,
		alternatePath,
		breadcrumbItems,
		seo: createPageSeo({
			title: `${entry.data.title} | ${dictionary.common.brand}`,
			description: entry.data.description,
			canonicalPath,
			type: 'article',
			image,
			publishedAt: entry.data.publishedAt,
			updatedAt: entry.data.updatedAt,
		}),
		alternates: createLocaleAlternates({
			site,
			pathsByLocale: {
				[locale]: canonicalPath,
				[alternateLocale]: alternatePath,
			},
		}),
		jsonLd: [
			createArticleJsonLd({
				site,
				path: canonicalPath,
				title: entry.data.title,
				description: entry.data.description,
				publishedAt: entry.data.publishedAt,
				updatedAt: entry.data.updatedAt,
				image,
				locale,
			}),
			createBreadcrumbListJsonLd({
				site,
				items: [
					{ label: dictionary.layout.nav_home, path: homePath },
					{ label: dictionary.common.articles, path: articlesPath },
					{ label: entry.data.title, path: canonicalPath },
				],
			}),
		],
	};
}
