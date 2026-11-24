import type { Locale } from '@/i18n/config';

export function isPublicArticle(data: { draft: boolean; locale: Locale }, locale?: Locale): boolean {
	if (data.draft) return false;
	if (locale) return data.locale === locale;
	return true;
}

export function getArticleSlug(entry: { id: string }): string {
	const parts = entry.id.split('/');
	return parts[parts.length - 1] ?? entry.id;
}
