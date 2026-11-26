import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CollectionEntry } from 'astro:content';
import { localizePath, type Locale } from '@/i18n/config';
import { getPublishedContent } from './getPublishedContent';

type Article = CollectionEntry<'articles'>;
type ApprovedArticle = Article & { data: Extract<Article['data'], { governance: unknown }> };
type EditorialEntry = ApprovedArticle | CollectionEntry<'news'>;
type Resource = CollectionEntry<'resources'>;
type Taxonomy = 'categories' | 'tags';
type Link = { label: string; href: string };

const familyRoutes = { articles: 'insights/articles', news: 'insights/news', resources: 'resources' } as const;
const copy = {
	ar: {
		insights: 'مركز المعرفة',
		articles: 'المقالات',
		news: 'الأخبار',
		resources: 'الموارد والأدلة',
		articlesDescription: 'المقالات المنشورة في مركز المعرفة.',
		newsDescription: 'الأخبار والتحديثات المنشورة.',
		resourcesDescription: 'الأدلة والملفات المتاحة للتنزيل.',
		categories: 'التصنيفات',
		tags: 'الوسوم',
		related: 'محتوى ذو صلة',
		author: 'بقلم',
		guide: 'دليل',
		report: 'تقرير',
		checklist: 'قائمة تحقق',
		reference: 'مرجع',
	},
	en: {
		insights: 'Knowledge center',
		articles: 'Articles',
		news: 'News',
		resources: 'Resources and guides',
		articlesDescription: 'Published articles from the knowledge center.',
		newsDescription: 'Published announcements and updates.',
		resourcesDescription: 'Guides and files available for download.',
		categories: 'Categories',
		tags: 'Tags',
		related: 'Related content',
		author: 'By',
		guide: 'Guide',
		report: 'Report',
		checklist: 'Checklist',
		reference: 'Reference',
	},
} as const;

export { copy as editorialCopy };

const hasApprovalContract = (entry: Article): entry is ApprovedArticle => 'governance' in entry.data;

async function loadEditorialContent() {
	const [articles, news, resources, pages, authors, products, services, solutions] = await Promise.all([getPublishedContent('articles'), getPublishedContent('news'), getPublishedContent('resources'), getPublishedContent('pages'), getPublishedContent('authors'), getPublishedContent('products'), getPublishedContent('services'), getPublishedContent('solutions')]);
	return { articles: articles.filter(hasApprovalContract), news, resources, pages, authors, products, services, solutions };
}

let buildContent: ReturnType<typeof loadEditorialContent> | undefined;
const getEditorialContent = () => (import.meta.env.DEV ? loadEditorialContent() : (buildContent ??= loadEditorialContent()));

function inLocale<T extends { data: { locale: Locale } }>(entries: readonly T[], locale: Locale) {
	return entries.filter(({ data }) => data.locale === locale);
}

function sortRecent<T extends { data: { publishedAt: Date } }>(entries: T[]) {
	return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

function taxonomyLinks(entries: readonly EditorialEntry[], taxonomy: Taxonomy) {
	const terms = new Map<string, string>();
	for (const { data } of entries) {
		const keys = taxonomy === 'categories' ? [data.category] : data.tags;
		for (const key of keys) {
			const label = taxonomy === 'categories' ? data.categoryLabel : data.tagLabels[key];
			if (!terms.has(key) || terms.get(key) === key) terms.set(key, label ?? key);
		}
	}
	return terms;
}

export function getApprovedArticlePath(locale: Locale, slug: string) {
	return localizePath(locale, `${familyRoutes.articles}/${slug}`);
}

export async function getEditorialNavigation(locale: Locale) {
	const content = await getEditorialContent();
	const hub = inLocale(content.pages, locale).find(({ data }) => data.translationKey === 'insights');
	return [...(hub ? [{ key: 'insights', href: localizePath(locale, 'insights'), title: hub.data.title }] : []), ...(['articles', 'news', 'resources'] as const).flatMap((key) => (content[key].some(({ data }) => data.locale === locale) ? [{ key, href: localizePath(locale, familyRoutes[key]), title: copy[locale][key] }] : []))];
}

export async function getEditorialPaths(locale: Locale, root: 'insights' | 'resources') {
	const other = locale === 'ar' ? 'en' : 'ar';
	const content = await getEditorialContent();
	const navigation = await getEditorialNavigation(locale);
	const hub = inLocale(content.pages, locale).find(({ data }) => data.translationKey === 'insights');
	const translatedHub = inLocale(content.pages, other).find(({ data }) => data.translationKey === 'insights');
	const local = (route: string) => localizePath(locale, route);
	const alt = (route: string) => localizePath(other, route);
	const hubLink = hub ? { label: hub.data.title, href: local('insights') } : undefined;
	const relatedCommercial = (entry: EditorialEntry | Resource): Link[] => (['products', 'services', 'solutions'] as const).flatMap((collection) => content[collection].filter(({ data }) => data.locale === locale && entry.data[collection].includes(data.translationKey)).map(({ data }) => ({ label: data.title, href: local(`${collection}/${data.slug}`) })));
	const resources = sortRecent(inLocale(content.resources, locale));
	if (root === 'resources') {
		if (!resources.length) return [];
		const links = [...inLocale(content.articles, locale), ...inLocale(content.news, locale)];
		return [
			{
				params: { path: undefined },
				props: {
					kind: 'resources' as const,
					locale,
					path: local('resources'),
					title: copy[locale].resources,
					description: copy[locale].resourcesDescription,
					alternatePath: inLocale(content.resources, other).length ? alt('resources') : undefined,
					parents: hubLink ? [hubLink] : [],
					entries: resources.map((entry) => ({
						entry,
						sizeBytes: entry.data.file.sizeBytes ?? statSync(resolve('public', entry.data.file.path.slice(1))).size,
						related: [...relatedCommercial(entry), ...links.filter(({ collection, data }) => entry.data[collection].includes(data.translationKey)).map(({ collection, data }) => ({ label: data.title, href: local(`${familyRoutes[collection]}/${data.slug}`) }))],
					})),
				},
			},
		];
	}
	const hubPaths = hub
		? [
				{
					params: { path: undefined },
					props: {
						kind: 'hub' as const,
						locale,
						path: local('insights'),
						title: hub.data.title,
						description: hub.data.description,
						entry: hub,
						alternatePath: translatedHub ? alt('insights') : undefined,
						parents: [],
						sections: navigation.filter(({ key }) => key !== 'insights').map(({ href, title }) => ({ label: title, href })),
					},
				},
			]
		: [];
	const families = (['articles', 'news'] as const).flatMap((family) => {
		const entries = sortRecent(inLocale<EditorialEntry>(content[family], locale));
		if (!entries.length) return [];
		const translated = inLocale<EditorialEntry>(content[family], other);
		const base = familyRoutes[family];
		const familyLabel = copy[locale][family];
		const description = family === 'articles' ? copy[locale].articlesDescription : copy[locale].newsDescription;
		const parents = hubLink ? [hubLink] : [];
		const detailParents = [...parents, { label: familyLabel, href: local(base) }];
		const taxonomies = (['categories', 'tags'] as const).map((taxonomy) => ({
			taxonomy,
			terms: [...taxonomyLinks(entries, taxonomy)].map(([key, label]) => ({ key, label, href: local(`${base}/${taxonomy}/${key}`) })),
		}));
		const listing = {
			params: { path: family },
			props: {
				kind: 'list' as const,
				locale,
				path: local(base),
				title: familyLabel,
				description,
				parents,
				alternatePath: translated.length ? alt(base) : undefined,
				entries,
				taxonomies,
			},
		};
		const filters = taxonomies.flatMap(({ taxonomy, terms }) => {
			const translatedTerms = taxonomyLinks(translated, taxonomy);
			return terms.map(({ key, label, href }) => ({
				params: { path: `${family}/${taxonomy}/${key}` },
				props: {
					kind: 'list' as const,
					locale,
					path: href,
					title: `${familyLabel} · ${label}`,
					description: `${copy[locale][taxonomy]} · ${label} · ${familyLabel}`,
					parents: detailParents,
					alternatePath: translatedTerms.has(key) ? alt(`${base}/${taxonomy}/${key}`) : undefined,
					entries: entries.filter(({ data }) => (taxonomy === 'categories' ? data.category === key : data.tags.includes(key))),
					taxonomies,
				},
			}));
		});
		const details = entries.map((entry) => {
			const { data } = entry;
			const sibling = translated.find(({ data: candidate }) => candidate.translationKey === data.translationKey);
			const author = inLocale(content.authors, locale).find(({ data: candidate }) => data.author && candidate.translationKey === data.author);
			const topical = entries.filter((candidate) => candidate !== entry && (candidate.data.category === data.category || candidate.data.tags.some((tag) => data.tags.includes(tag))));
			return {
				params: { path: `${family}/${data.slug}` },
				props: {
					kind: 'detail' as const,
					locale,
					path: local(`${base}/${data.slug}`),
					title: data.title,
					description: data.description,
					parents: detailParents,
					alternatePath: sibling ? alt(`${base}/${sibling.data.slug}`) : undefined,
					entry,
					author: author?.data.title,
					taxonomies: taxonomies.map(({ taxonomy, terms }) => ({ taxonomy, terms: terms.filter(({ key }) => (taxonomy === 'categories' ? data.category === key : data.tags.includes(key))) })),
					related: [...topical.slice(0, 3).map(({ data }) => ({ label: data.title, href: local(`${base}/${data.slug}`) })), ...relatedCommercial(entry)],
				},
			};
		});
		return [listing, ...filters, ...details];
	});
	return [...hubPaths, ...families];
}

export type EditorialPageProps = Awaited<ReturnType<typeof getEditorialPaths>>[number]['props'];

export function getEditorialEntryPath(entry: EditorialEntry) {
	return localizePath(entry.data.locale, `${familyRoutes[entry.collection]}/${entry.data.slug}`);
}
