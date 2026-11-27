import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

/** @param {URL} directory @param {readonly string[]} locales */
export async function bundleHomeStyles(directory, locales) {
	for (const locale of locales) {
		const page = new URL(`${locale}/index.html`, directory);
		const html = await readFile(page, 'utf8');
		const headEnd = html.indexOf('</head>');
		if (headEnd < 0) throw new Error(`Missing head in ${page.pathname}`);

		const head = html.slice(0, headEnd);
		// Match only the unconditional CSS tags emitted by Astro, in cascade order.
		const styleTag = /<link rel="stylesheet" href="(\/_astro\/[\w.-]+\.css)">|<style>([\s\S]*?)<\/style>/g;
		const styles = [...head.matchAll(styleTag)];
		const stylesheetCount = styles.filter(([, href]) => href).length;
		if (stylesheetCount <= 1) continue;
		if ((head.match(/<link\b[^>]*\brel="stylesheet"|<style\b/g) ?? []).length !== styles.length) {
			throw new Error(`Unexpected stylesheet attributes in ${page.pathname}`);
		}

		const chunks = await Promise.all(
			styles.map(async ([, href, inline]) => {
				const css = href ? await readFile(new URL(href.slice(1), directory), 'utf8') : inline;
				if (/@(?:import|charset)\b/i.test(css) || (!href && /\burl\(/i.test(css))) {
					throw new Error(`Cannot move this stylesheet without changing its meaning in ${page.pathname}`);
				}
				return css;
			}),
		);
		const css = chunks.join('\n');
		const hash = createHash('sha256').update(css).digest('hex').slice(0, 16);
		const asset = `_astro/home.${hash}.css`;
		await writeFile(new URL(asset, directory), css);
		const updatedHead = head.replace(styleTag, (_tag, _href, _inline, offset) => (offset === styles[0].index ? `<link rel="stylesheet" href="/${asset}">` : ''));
		await writeFile(page, updatedHead + html.slice(headEnd));
	}
}
