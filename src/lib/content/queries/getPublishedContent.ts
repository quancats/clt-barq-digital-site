import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublishedContent, validatePublication, type PublicationCandidate } from '@/lib/content/publication';
import type { Locale } from '@/i18n/config';
import type { collections } from '@/content.config';
import { isPreviewAsset } from '@/data/previewAssets';

type CollectionName = keyof typeof collections;
const collectionNames = ['pages', 'products', 'services', 'solutions', 'industries', 'projects', 'articles', 'news', 'resources', 'authors', 'legal'] as const satisfies readonly CollectionName[];

function asCandidate(entry: CollectionEntry<CollectionName>): PublicationCandidate[] {
	const { data } = entry;
	if (!('governance' in data)) return [];
	return [
		{
			sourceId: entry.id,
			collection: entry.collection,
			contentId: data.contentId,
			translationKey: data.translationKey,
			locale: data.locale,
			slug: data.slug,
			governance: data.governance,
			assets: [...data.media.flatMap(({ path, variants }) => [path, ...(variants?.map((variant) => variant.path) ?? [])]), ...('file' in data ? [data.file.path] : []), ...('profile' in data && data.profile ? [data.profile.path] : [])],
			relations: [...('products' in data ? data.products.map((translationKey) => ({ collection: 'products', translationKey })) : []), ...('services' in data ? data.services.map((translationKey) => ({ collection: 'services', translationKey })) : []), ...('solutions' in data ? data.solutions.map((translationKey) => ({ collection: 'solutions', translationKey })) : []), ...('projects' in data ? data.projects.map((translationKey) => ({ collection: 'projects', translationKey })) : []), ...('author' in data && data.author ? [{ collection: 'authors', translationKey: data.author }] : [])],
		},
	];
}

async function validateAllContent() {
	const entries = await Promise.all(collectionNames.map((name) => getCollection(name)));
	validatePublication(
		entries.flatMap((collection) => collection.flatMap(asCandidate)),
		(path) => !isPreviewAsset(path) && Boolean(statSync(resolve(process.cwd(), 'public', path.slice(1)), { throwIfNoEntry: false })?.isFile()),
	);
}

let buildValidation: Promise<void> | undefined;

export function validateWebsiteContent() {
	if (import.meta.env.DEV) return validateAllContent();
	return (buildValidation ??= validateAllContent());
}

export async function getPublishedContent<Name extends CollectionName>(collection: Name, locale?: Locale): Promise<CollectionEntry<Name>[]> {
	await validateWebsiteContent();
	const entries = await getCollection(collection, ({ data }) => 'governance' in data && isPublishedContent(data) && (!locale || data.locale === locale));
	return entries.sort((left, right) => {
		if (!('sortOrder' in left.data) || !('sortOrder' in right.data)) return 0;
		return left.data.sortOrder - right.data.sortOrder || left.id.localeCompare(right.id);
	});
}
