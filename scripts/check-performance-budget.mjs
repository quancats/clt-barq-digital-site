import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { readBuild } from './build-output.mjs';

const BUILD_DIR = path.resolve('dist');
const DIST_DIR = path.join(BUILD_DIR, '_astro');
const CSS_BASELINE = {
	'/ar/': { files: 1, gzipBytes: 19065 },
	'/en/': { files: 1, gzipBytes: 18739 },
	'/ar/components/': { files: 2, gzipBytes: 22118 },
	'/en/components/': { files: 2, gzipBytes: 21792 },
};

async function checkRouteCss(failures) {
	const { pages } = await readBuild(BUILD_DIR);
	const report = {};
	for (const [route, baseline] of Object.entries(CSS_BASELINE)) {
		const page = pages.get(route);
		if (!page) {
			failures.push('Missing CSS reference route ' + route);
			continue;
		}
		const stylesheets = new Set(page.elements.filter(({ name, attributes }) => name === 'link' && attributes.rel === 'stylesheet' && attributes.href?.startsWith('/_astro/')).map(({ attributes }) => attributes.href));
		const html = await readFile(path.join(BUILD_DIR, page.file), 'utf8');
		const inlineStyles = [...html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)].map(([, css]) => gzipSize(css));
		const stylesheetSizes = await Promise.all([...stylesheets].map(async (href) => gzipSize(await readFile(path.join(BUILD_DIR, href)))));
		const gzipBytes = [...inlineStyles, ...stylesheetSizes].reduce((total, bytes) => total + bytes, 0);
		const budgetGzipBytes = Math.ceil(baseline.gzipBytes * 1.1);
		report[route] = { stylesheetCount: stylesheets.size, inlineStyleCount: inlineStyles.length, gzipBytes, baseline, budgetGzipBytes };
		if (stylesheets.size > baseline.files || gzipBytes > budgetGzipBytes) failures.push(route + ' exceeds its CSS file or gzip budget');
	}
	return report;
}

/**
 * Data-driven island budgets. Adopting projects that remove an island
 * (for example ComponentCatalog) should delete that entry rather than
 * rewriting filter/assertion logic.
 */
const ISLAND_BUDGETS = [
	{
		id: 'header',
		label: 'Header route JS',
		chunkIncludes: ['headerchrome'],
		includeShared: true,
		includeIslandIds: [],
		budgetGzipBytes: 120 * 1024,
		required: true,
	},
	{
		id: 'catalog',
		label: 'Catalog route JS',
		chunkIncludes: ['componentcatalog'],
		includeShared: true,
		includeIslandIds: ['header'],
		budgetGzipBytes: 220 * 1024,
		required: true,
	},
];

const SHARED_CHUNK_MATCHERS = [(name) => name.includes('rekalocaleprovider'), (name) => name.includes('runtime-dom'), (name) => name === 'client.bizi63nh.js', (name) => /^client\./.test(name), (name) => name.includes('vue')];

async function listJsFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listJsFiles(fullPath)));
			continue;
		}
		if (entry.isFile() && entry.name.endsWith('.js')) {
			files.push(fullPath);
		}
	}
	return files;
}

function gzipSize(buffer) {
	return gzipSync(buffer).byteLength;
}

function baseName(filePath) {
	return path.basename(filePath).toLowerCase();
}

function sumGzip(items) {
	return items.reduce((sum, item) => sum + item.gz, 0);
}

function matchShared(name) {
	return SHARED_CHUNK_MATCHERS.some((matcher) => matcher(name));
}

async function main() {
	const files = await listJsFiles(DIST_DIR);
	if (files.length === 0) {
		throw new Error(`No JS chunks found under ${DIST_DIR}. Run a production build first.`);
	}

	const measured = [];
	for (const filePath of files) {
		const buffer = await readFile(filePath);
		measured.push({
			filePath,
			name: baseName(filePath),
			gz: gzipSize(buffer),
			raw: (await stat(filePath)).size,
		});
	}

	const shared = measured.filter((item) => matchShared(item.name));
	const ownedByIsland = new Map();
	for (const island of ISLAND_BUDGETS) {
		ownedByIsland.set(
			island.id,
			measured.filter((item) => island.chunkIncludes.some((needle) => item.name.includes(needle))),
		);
	}

	const failures = [];
	const report = {
		chunkCount: measured.length,
		islands: {},
		topChunks: [...measured]
			.sort((a, b) => b.gz - a.gz)
			.slice(0, 8)
			.map((item) => ({
				file: path.relative(process.cwd(), item.filePath),
				gzipBytes: item.gz,
			})),
	};

	for (const island of ISLAND_BUDGETS) {
		const owned = ownedByIsland.get(island.id) ?? [];
		const included = [];
		for (const otherId of island.includeIslandIds) {
			included.push(...(ownedByIsland.get(otherId) ?? []));
		}
		const totalParts = [...owned, ...included, ...(island.includeShared ? shared : [])];
		const total = sumGzip(totalParts);

		report.islands[island.id] = {
			label: island.label,
			gzipBytes: total,
			budgetGzipBytes: island.budgetGzipBytes,
			ownedChunkCount: owned.length,
		};

		if (island.required && owned.length === 0) {
			failures.push(`Could not find a ${island.label} client chunk in dist/_astro.`);
		}
		if (total > island.budgetGzipBytes) {
			failures.push(`${island.label} ${total} B gzipped exceeds ${island.budgetGzipBytes} B budget`);
		}
	}

	report.routeCss = await checkRouteCss(failures);
	console.log(JSON.stringify(report, null, 2));

	if (failures.length > 0) {
		throw new Error(failures.join('\n'));
	}
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
