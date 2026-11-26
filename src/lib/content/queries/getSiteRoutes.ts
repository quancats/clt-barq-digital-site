import { localizePath, type Locale } from '@/i18n/config';
import { getPublishedContent } from './getPublishedContent';

export const commercialFamilies = ['products', 'services', 'solutions', 'industries'] as const;
export type CommercialFamily = (typeof commercialFamilies)[number];

export const corporatePaths = {
	about: 'about',
	projects: 'projects',
	contact: 'contact',
	consultation: 'contact/consultation',
	demo: 'contact/demo',
	partners: 'partners',
	faq: 'faq',
} as const;

export const sectionTitles = {
	ar: { products: 'المنتجات', services: 'الخدمات', solutions: 'الحلول', industries: 'القطاعات', articles: 'المقالات' },
	en: { products: 'Products', services: 'Services', solutions: 'Solutions', industries: 'Industries', articles: 'Articles' },
};

async function loadSiteContent() {
	const [pages, legal, projects, products, services, solutions, industries] = await Promise.all([getPublishedContent('pages'), getPublishedContent('legal'), getPublishedContent('projects'), getPublishedContent('products'), getPublishedContent('services'), getPublishedContent('solutions'), getPublishedContent('industries')]);
	return { pages, legal, projects, products, services, solutions, industries };
}

let siteContent: ReturnType<typeof loadSiteContent> | undefined;

export function getSiteContent() {
	return import.meta.env.DEV ? loadSiteContent() : (siteContent ??= loadSiteContent());
}

export async function getSiteSections(locale: Locale) {
	const content = await getSiteContent();
	const pages = Object.entries(corporatePaths).flatMap(([key, path]) => {
		const entry = content.pages.find(({ data }) => data.locale === locale && data.translationKey === key);
		return entry ? [{ key, href: localizePath(locale, path), title: entry.data.title, description: entry.data.description, media: entry.data.media }] : [];
	});
	const legal = ['privacy', 'terms'].flatMap((key) => {
		const entry = content.legal.find(({ data, body }) => data.locale === locale && data.translationKey === key && body?.trim());
		return entry ? [{ key, href: localizePath(locale, key), title: entry.data.title, description: entry.data.description, media: entry.data.media }] : [];
	});
	const catalogs = commercialFamilies.flatMap((key) => {
		const entries = content[key].filter(({ data }) => data.locale === locale);
		return entries.length ? [{ key, href: localizePath(locale, key), title: sectionTitles[locale][key], description: '', media: [] }] : [];
	});
	const bim = content.products.find(({ data }) => data.locale === locale && data.translationKey === 'bim');
	return [...pages, ...catalogs, ...legal, ...(bim ? [{ key: 'bim', href: localizePath(locale, `products/${bim.data.slug}`), title: bim.data.title, description: bim.data.description, media: bim.data.media }] : [])];
}
