import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';
import { checkInternalLinks } from '../../scripts/check-internal-links.mjs';

test('resolves links against their source and reports missing routes and fragments', async () => {
	const directory = await mkdtemp(path.join(tmpdir(), 'astro-links-'));
	try {
		await mkdir(path.join(directory, 'en', 'guide.v1'), { recursive: true });
		await mkdir(path.join(directory, 'en', 'source'), { recursive: true });
		await writeFile(path.join(directory, 'en', 'guide.v1', 'index.html'), '<h1 id="a&amp;b">Guide</h1>');
		await writeFile(path.join(directory, 'download.pdf'), '');
		await writeFile(
			path.join(directory, 'en', 'source', 'index.html'),
			`<link rel="canonical" href="https://site.example.com/en/source/">
			<a href="../guide.v1/#a%26b">Dotted directory and existing fragment</a>
			<a href="https://site.example.com/en/guide.v1/">Same-origin absolute</a>
			<a href="https://site.example.com/en/broken/">Same-origin missing</a>
			<a href="../../download.pdf?version=2">Static file</a>
			<a href="../missing/">Missing destination</a>
			<a href="../guide.v1/#missing">Missing fragment</a>`,
		);
		const result = await checkInternalLinks(directory, { checkIsolated: true });
		expect(result.brokenInternalLinks).toEqual([
			{ from: '/en/source/', href: 'https://site.example.com/en/broken/', reason: 'missing destination' },
			{ from: '/en/source/', href: '../missing/', reason: 'missing destination' },
			{ from: '/en/source/', href: '../guide.v1/#missing', reason: 'missing fragment' },
		]);
		expect(result.isolatedPages).toEqual(['/en/source/']);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
