/**
 * Primary site navigation paths (locale-agnostic).
 * Localize with `localizePath(locale, path)` at the call site.
 */
export const primaryNavPaths = {
	home: '/',
	articles: '/articles',
	components: '/components',
} as const;

export type PrimaryNavKey = keyof typeof primaryNavPaths;
