import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { decodeHTML, decodeHTMLAttribute } from 'entities';
import { ELEMENT_NODE, parse, walkSync } from 'ultrahtml';

export async function readBuild(directory) {
	const files = await readdir(directory, { recursive: true, withFileTypes: true });
	const assets = new Set();
	const pages = new Map();
	for (const file of files) {
		if (!file.isFile()) continue;
		const filename = path.join(file.parentPath, file.name);
		const asset = '/' + path.relative(directory, filename).split(path.sep).join('/');
		assets.add(asset);
		if (!asset.endsWith('.html')) continue;
		const url = asset.replace(/\/index\.html$/, '/');
		const elements = [];
		const structuredData = [];
		let title = '';
		walkSync(parse(await readFile(filename, 'utf8')), (node) => {
			if (node.type !== ELEMENT_NODE) return;
			const attributes = Object.fromEntries(Object.entries(node.attributes).map(([key, value]) => [key.toLowerCase(), decodeHTMLAttribute(value)]));
			const name = node.name.toLowerCase();
			elements.push({ name, attributes });
			if (name === 'title') title = decodeHTML(node.children.map(({ value }) => value).join(''));
			if (name === 'script' && attributes.type === 'application/ld+json') structuredData.push(node.children.map(({ value }) => value).join(''));
		});
		pages.set(url, {
			file: asset,
			elements,
			title,
			structuredData,
			ids: new Set(elements.map((node) => node.attributes.id).filter(Boolean)),
			noindex: elements.some(({ name, attributes }) => name === 'meta' && attributes.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(attributes.content ?? '')),
			redirect: elements.some(({ name, attributes }) => name === 'meta' && attributes['http-equiv']?.toLowerCase() === 'refresh'),
			error: /\/(?:[45]\d\d)(?:\.html|\/)$/.test(url),
		});
	}
	return { assets, pages };
}

export function resolvePage(pages, pathname) {
	return pages.get(pathname) ?? pages.get(pathname.replace(/\/index\.html$/, '/')) ?? pages.get(pathname + '/');
}
