import { closeSync, lstatSync, openSync, readSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
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
			relations: [...('products' in data ? data.products.map((translationKey) => ({ collection: 'products', translationKey })) : []), ...('services' in data ? data.services.map((translationKey) => ({ collection: 'services', translationKey })) : []), ...('solutions' in data ? data.solutions.map((translationKey) => ({ collection: 'solutions', translationKey })) : []), ...('projects' in data ? data.projects.map((translationKey) => ({ collection: 'projects', translationKey })) : []), ...('articles' in data ? data.articles.map((translationKey) => ({ collection: 'articles', translationKey })) : []), ...('news' in data ? data.news.map((translationKey) => ({ collection: 'news', translationKey })) : []), ...('author' in data && data.author ? [{ collection: 'authors', translationKey: data.author }] : [])],
		},
	];
}

async function validateAllContent() {
	const entries = await Promise.all(collectionNames.map((name) => getCollection(name)));
	const publicRoot = resolve(process.cwd(), 'public');
	validatePublication(
		entries.flatMap((collection) => collection.flatMap(asCandidate)),
		(path) => !isPreviewAsset(path) && Boolean(statSync(resolve(publicRoot, path.slice(1)), { throwIfNoEntry: false })?.isFile()),
	);
	const approvedDownloads = new Map<string, number | undefined>();
	for (const { body, collection, data, id } of entries.flat()) {
		if (!('governance' in data) || !isPublishedContent(data)) continue;
		if ((collection === 'articles' || collection === 'news') && !body?.trim()) throw new Error(`Approved editorial entry needs a body: ${collection}/${id}`);
		const file = 'file' in data ? data.file : 'profile' in data ? data.profile : undefined;
		if (!file) continue;
		const previous = approvedDownloads.get(file.path);
		if (previous !== undefined && file.sizeBytes !== undefined && previous !== file.sizeBytes) throw new Error(`Conflicting public download sizes: ${file.path}`);
		approvedDownloads.set(file.path, file.sizeBytes ?? previous);
	}
	const downloadRoot = resolve(publicRoot, 'downloads');
	const downloadDirectory = lstatSync(downloadRoot, { throwIfNoEntry: false });
	if (!downloadDirectory) return;
	if (!downloadDirectory.isDirectory()) throw new Error('Public downloads must be stored in a local directory');
	const publicDownloads = readdirSync(downloadRoot, { withFileTypes: true, recursive: true });
	for (const download of publicDownloads) {
		if (download.isDirectory()) continue;
		const absolute = resolve(download.parentPath, download.name);
		const url = '/downloads/' + relative(downloadRoot, absolute).split(sep).join('/');
		if (!download.isFile() || !approvedDownloads.has(url)) throw new Error(`Unapproved public download: ${url}`);
		const declaredSize = approvedDownloads.get(url);
		if (declaredSize !== undefined && statSync(absolute).size !== declaredSize) throw new Error(`Public download size mismatch: ${url}`);
		const descriptor = openSync(absolute, 'r');
		try {
			const signature = Buffer.alloc(5);
			readSync(descriptor, signature, 0, signature.length, 0);
			if (signature.toString('ascii') !== '%PDF-') throw new Error(`Public download is missing the PDF signature: ${url}`);
		} finally {
			closeSync(descriptor);
		}
	}
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
