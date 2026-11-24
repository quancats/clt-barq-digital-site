export function createCanonicalUrl(options: { site: URL | string; path: string }): URL {
	const site = typeof options.site === 'string' ? new URL(options.site) : options.site;
	const normalizedPath = options.path.startsWith('/') ? options.path : `/${options.path}`;
	return new URL(normalizedPath, site);
}
