import type { CollectionEntry } from 'astro:content';
import { localizePath, type Locale } from '@/i18n/config';
import { commercialFamilies, corporatePaths, getSiteContent, getSiteSections, type CommercialFamily } from './getSiteRoutes';

type CommercialEntry = CollectionEntry<CommercialFamily>;
type DetailEntry = CommercialEntry | CollectionEntry<'projects'>;
export type RelatedLink = { title: string; description: string; href: string; family: CommercialFamily | 'projects' };

export async function getSitePagePaths(locale: Locale) {
	const other = locale === 'ar' ? 'en' : 'ar';
	const [content, sections] = await Promise.all([getSiteContent(), getSiteSections(locale)]);
	const links = Object.fromEntries(sections.map(({ key, href }) => [key, href]));
	const projects = content.projects.filter(({ data }) => data.locale === locale);
	const localPath = (route: string) => localizePath(locale, route);
	const section = (key: string) => sections.find((item) => item.key === key);
	const bimProduct = content.products.find(({ data }) => data.locale === locale && data.translationKey === 'bim');
	const bimProject = projects.find(({ data }) => data.kind === 'owned-product' && data.translationKey === 'bim');
	const bim = bimProduct
		? {
				product: bimProduct.data,
				href: localPath(`products/${bimProduct.data.slug}`),
				storyHref: bimProject ? localPath(`projects/${bimProject.data.slug}`) : undefined,
				demoHref: section('demo')?.href,
			}
		: undefined;
	const catalogRelated = (entry: DetailEntry): RelatedLink[] =>
		commercialFamilies.flatMap((family) => {
			const references = family in entry.data ? ((entry.data as Partial<Record<CommercialFamily, string[]>>)[family] ?? []) : [];
			return content[family].filter(({ data }) => data.locale === locale && references.includes(data.translationKey)).map(({ data }) => ({ title: data.title, description: data.description, href: localPath(`${family}/${data.slug}`), family }));
		});
	const corporate = Object.entries(corporatePaths).flatMap(([key, route]) => {
		const entry = content.pages.find(({ data }) => data.locale === locale && data.translationKey === key);
		if (!entry) return [];
		const alternatePath = content.pages.some(({ data }) => data.locale === other && data.translationKey === key) ? localizePath(other, route) : undefined;
		const relatedKeys = key === 'about' ? ['products', 'services', 'solutions'] : key === 'contact' ? ['consultation', 'demo', 'partners'] : [];
		const related = sections.filter(({ key }) => relatedKeys.includes(key)).map(({ href, title }) => ({ href, label: title }));
		const common = { entry, path: localPath(route), alternatePath, links, related };
		const props =
			key === 'projects'
				? {
						...common,
						kind: 'projects' as const,
						projects: projects.map((project) => ({
							entry: project,
							href: localPath(`projects/${project.data.slug}`),
						})),
					}
				: {
						...common,
						kind: 'page' as const,
						services: key === 'consultation' ? content.services.filter(({ data }) => data.locale === locale).map(({ data }) => ({ key: data.translationKey, label: data.title })) : [],
					};
		return [{ params: { barq: route }, props }];
	});
	const legal = content.legal.flatMap((entry) => {
		const { locale: language, translationKey: key } = entry.data;
		if (language !== locale || !entry.body?.trim() || (key !== 'privacy' && key !== 'terms')) return [];
		const alternatePath = content.legal.some(({ data, body }) => data.locale === other && data.translationKey === key && body?.trim()) ? localizePath(other, key) : undefined;
		return [{ params: { barq: key }, props: { kind: 'legal' as const, entry, path: localPath(key), alternatePath, links } }];
	});
	const projectDetails = projects.map((entry) => {
		const route = `projects/${entry.data.slug}`;
		const translation = content.projects.find(({ data }) => data.locale === other && data.translationKey === entry.data.translationKey);
		const related = catalogRelated(entry).map(({ href, title }) => ({ href, label: title }));
		if (entry.data.kind === 'owned-product' && entry.data.translationKey === 'bim') {
			const bim = section('bim');
			if (bim && !related.some(({ href }) => href === bim.href)) related.push({ href: bim.href, label: bim.title });
		}
		return { params: { barq: route }, props: { kind: 'project' as const, entry, path: localPath(route), alternatePath: translation ? localizePath(other, `projects/${translation.data.slug}`) : undefined, links, related } };
	});
	const catalogs = commercialFamilies.flatMap((family) => {
		const entries = content[family].filter(({ data }) => data.locale === locale);
		const overview = content.pages.find(({ data }) => data.locale === locale && data.translationKey === family);
		if (family === 'products') entries.sort((left, right) => Number(right.data.translationKey === 'bim') - Number(left.data.translationKey === 'bim'));
		if (!entries.length) return [];
		const alternatePath = content[family].some(({ data }) => data.locale === other) ? localizePath(other, family) : undefined;
		return [
			{
				params: { barq: family },
				props: {
					kind: 'catalog' as const,
					locale,
					family,
					path: localPath(family),
					alternatePath,
					entries: entries.map(({ data }) => ({
						key: data.translationKey,
						title: data.title,
						description: data.description,
						href: localPath(`${family}/${data.slug}`),
						featured: data.featured || (family === 'products' && data.translationKey === 'bim'),
						...('category' in data && data.category ? { category: data.category } : {}),
						...('problem' in data ? { problem: data.problem } : {}),
					})),
					overview,
					bim: family === 'products' ? bim : undefined,
					consultationHref: section('consultation')?.href,
				},
			},
		];
	});
	const details = commercialFamilies.flatMap((family) =>
		content[family]
			.filter(({ data }) => data.locale === locale)
			.map((entry) => {
				const { data } = entry;
				const route = `${family}/${data.slug}`;
				const translation = content[family].find(({ data: candidate }) => candidate.locale === other && candidate.translationKey === data.translationKey);
				const isBim = family === 'products' && data.translationKey === 'bim';
				const destination = section(isBim ? 'demo' : 'consultation');
				const cta = destination ? { label: destination.title, href: family === 'services' ? `${destination.href}?service=${encodeURIComponent(data.translationKey)}` : destination.href } : undefined;
				const officialLink = 'officialUrl' in data && data.officialUrl ? { href: data.officialUrl, label: locale === 'ar' ? 'الموقع الرسمي' : 'Official website' } : undefined;
				const related = catalogRelated(entry);
				if ('projects' in data) {
					related.push(
						...projects
							.filter((project) => data.projects.includes(project.data.translationKey))
							.map(({ data: project }) => ({
								title: project.title,
								description: project.description,
								href: localPath(`projects/${project.slug}`),
								family: 'projects' as const,
							})),
					);
				}
				return { params: { barq: route }, props: { kind: 'commercial' as const, locale, family, path: localPath(route), alternatePath: translation ? localizePath(other, `${family}/${translation.data.slug}`) : undefined, entry, related, cta, officialLink } };
			}),
	);
	return [...corporate, ...legal, ...projectDetails, ...catalogs, ...details];
}

export type SitePageProps = Awaited<ReturnType<typeof getSitePagePaths>>[number]['props'];
