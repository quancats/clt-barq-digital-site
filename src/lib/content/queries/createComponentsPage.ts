import { localizePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/helpers';
import { createLocaleAlternates } from '@/lib/seo/createLocaleAlternates';
import { createPageSeo } from '@/lib/seo/createPageSeo';
import { createBreadcrumbListJsonLd } from '@/lib/seo/structured-data/createBreadcrumbListJsonLd';

export function createComponentsPage(options: { locale: Locale; site: URL }) {
	const { locale, site } = options;
	const dictionary = getDictionary(locale);
	const canonicalPath = localizePath(locale, '/components');
	const homePath = localizePath(locale, '/');
	const alternateLocale: Locale = locale === 'ar' ? 'en' : 'ar';

	return {
		dictionary,
		seo: createPageSeo({
			title: `${dictionary.components.page_title} | ${dictionary.common.brand}`,
			description: dictionary.components.page_description,
			canonicalPath,
		}),
		alternates: createLocaleAlternates({
			site,
			pathsByLocale: {
				ar: localizePath('ar', '/components'),
				en: localizePath('en', '/components'),
			},
		}),
		alternatePath: localizePath(alternateLocale, '/components'),
		jsonLd: createBreadcrumbListJsonLd({
			site,
			items: [
				{ label: dictionary.layout.nav_home, path: homePath },
				{ label: dictionary.layout.nav_components, path: canonicalPath },
			],
		}),
	};
}
