import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mdxAllowlistedComponents } from '@/lib/content/rich-text/mdxAllowlist';

const CONTENT_ROOT = path.resolve(import.meta.dirname, '../../src/content');
const SOURCE_ROOT = path.resolve(import.meta.dirname, '../../src');
const IMPORT_PATTERN = /^\s*import\s+.+?\s+from\s+['"]([^'"]+)['"];?\s*$/gm;

async function collectMdxFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) return collectMdxFiles(entryPath);
			return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
		}),
	);

	return files.flat();
}

describe('MDX component allowlist', () => {
	it('allows every component imported by repository MDX content', async () => {
		const allowed = new Set<string>(mdxAllowlistedComponents);
		const mdxFiles = await collectMdxFiles(CONTENT_ROOT);

		for (const file of mdxFiles) {
			const source = await readFile(file, 'utf8');
			const imports = [...source.matchAll(IMPORT_PATTERN)].flatMap((match) => (match[1] ? [match[1]] : []));

			for (const importedComponent of imports) {
				expect(allowed.has(importedComponent), `${path.relative(CONTENT_ROOT, file)} imports non-allowlisted component ${importedComponent}`).toBe(true);
			}
		}
	});

	it('references component files that exist', async () => {
		for (const component of mdxAllowlistedComponents) {
			const componentPath = component.startsWith('@/') ? path.join(SOURCE_ROOT, component.slice(2)) : component;
			await expect(access(componentPath)).resolves.toBeUndefined();
		}
	});
});
