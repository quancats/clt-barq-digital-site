import type { Locale } from '@/i18n/config';
import { createCanonicalUrl } from '@/lib/seo/createCanonicalUrl';
import type { LocaleAlternate } from '@/lib/seo/types';

export function createLocaleAlternates(options: { site: URL | string; pathsByLocale: Partial<Record<Locale, string>>; includeXDefault?: boolean; xDefaultPath?: string }): LocaleAlternate[] {
	const alternates: LocaleAlternate[] = [];

	for (const [locale, path] of Object.entries(options.pathsByLocale)) {
		if (!path) continue;
		alternates.push({
			locale,
			href: createCanonicalUrl({ site: options.site, path }).toString(),
		});
	}

	if (options.includeXDefault && options.xDefaultPath) {
		alternates.push({
			locale: 'x-default',
			href: createCanonicalUrl({ site: options.site, path: options.xDefaultPath }).toString(),
		});
	}

	return alternates;
}
