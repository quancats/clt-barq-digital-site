/**
 * Returns whether a URL should appear in the generated sitemap.
 * Fail closed on invalid absolute URLs.
 *
 * Excludes:
 * - locale-less `/` (template redirects to the default locale)
 * - error pages (`404`, `500`)
 * - `robots.txt`, RSS feeds
 * - `.well-known` resources
 *
 * Keeps locale homes, articles, and the component catalog.
 */
export function isIndexableSitemapPage(page: string): boolean {
	let url: URL;
	try {
		url = new URL(page);
	} catch {
		return false;
	}

	const pathname = url.pathname.replace(/\/+$/, '') || '/';

	if (pathname === '/') {
		return false;
	}

	if (pathname === '/404' || pathname === '/500' || pathname.endsWith('/404') || pathname.endsWith('/500')) {
		return false;
	}

	if (pathname === '/robots.txt' || pathname.endsWith('/robots.txt')) {
		return false;
	}

	if (pathname.endsWith('/rss.xml') || pathname.endsWith('.xml')) {
		return false;
	}

	if (pathname.includes('/.well-known/') || pathname.startsWith('/.well-known')) {
		return false;
	}

	return true;
}
