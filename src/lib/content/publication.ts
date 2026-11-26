import { locales, type Locale } from '@/i18n/config';

type Governance = { status: 'draft' | 'review' | 'published' | 'archived'; approvalRef?: string | undefined };

const bilingualCollections = ['pages', 'products', 'services', 'solutions', 'legal'];

export type PublicationCandidate = {
	sourceId: string;
	collection: string;
	contentId: string;
	translationKey: string;
	locale: Locale;
	slug: string;
	governance: Governance;
	assets?: readonly string[] | undefined;
	relations?: readonly { collection: string; translationKey: string }[] | undefined;
};

export function isPublishedContent({ governance }: Pick<PublicationCandidate, 'governance'>): boolean {
	return governance.status === 'published' && Boolean(governance.approvalRef);
}

export function getLocalizedPublicationRoutes(entries: readonly PublicationCandidate[]) {
	const routes = new Map<string, Partial<Record<Locale, string>>>();
	for (const entry of entries.filter(isPublishedContent)) {
		const key = `${entry.collection}/${entry.translationKey}`;
		const slugsByLocale = routes.get(key) ?? {};
		slugsByLocale[entry.locale] = entry.slug;
		routes.set(key, slugsByLocale);
	}
	return routes;
}

export function validatePublication(entries: readonly PublicationCandidate[], assetExists: (path: string) => boolean): void {
	const identifiers = new Map<string, string>();
	const published = getLocalizedPublicationRoutes(entries);
	const publishedAssets = new Set(entries.filter(isPublishedContent).flatMap((entry) => entry.assets ?? []));
	const errors: string[] = [];

	for (const entry of entries) {
		const source = `${entry.collection}/${entry.sourceId}`;
		const prefix = `${entry.collection}/${entry.locale}`;
		const identifiersForEntry = [`content ID ${entry.contentId}`, `${prefix} slug ${entry.slug}`, `${prefix} translation key ${entry.translationKey}`];
		for (const identifier of identifiersForEntry) {
			const previous = identifiers.get(identifier);
			if (previous) errors.push(`${source}: duplicate ${identifier} (also defined in ${previous})`);
			identifiers.set(identifier, source);
		}

		if (entry.governance.status === 'published' && !isPublishedContent(entry)) {
			errors.push(`${source}: published content requires an approval reference`);
		}
		if (!isPublishedContent(entry)) {
			for (const asset of entry.assets ?? []) {
				if (!publishedAssets.has(asset) && assetExists(asset)) errors.push(`${source}: non-public content links to a public asset ${asset}`);
			}
			continue;
		}

		if (entry.collection === 'products' && (entry.translationKey === 'bim') !== (entry.slug === 'bim')) {
			errors.push(`${source}: the BIM flagship must use the reserved bim product slug`);
		}
		const requiredLocales = bilingualCollections.includes(entry.collection) ? locales : [];
		const translations = published.get(`${entry.collection}/${entry.translationKey}`);
		for (const locale of requiredLocales) {
			if (!translations?.[locale]) errors.push(`${source}: missing approved ${locale} translation`);
		}
		for (const relation of entry.relations ?? []) {
			const target = `${relation.collection}/${relation.translationKey}`;
			if (!published.get(target)?.[entry.locale]) errors.push(`${source}: ${target} has no approved ${entry.locale} entry`);
		}
		for (const asset of entry.assets ?? []) {
			if (!assetExists(asset)) errors.push(`${source}: missing public asset ${asset}`);
		}
	}

	if (errors.length) throw new Error(`Invalid website content:\n${errors.join('\n')}`);
}
