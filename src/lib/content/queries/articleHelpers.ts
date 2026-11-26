import type { Locale } from '@/i18n/config';
import { isPublishedContent, type PublicationCandidate } from '@/lib/content/publication';
import type { AppEnv } from '@/lib/env/appEnv';

type ArticleVisibility = ({ draft: boolean } | Pick<PublicationCandidate, 'governance'>) & { locale: Locale };

export function isPublicArticle(data: ArticleVisibility, locale?: Locale, environment: AppEnv = 'local'): boolean {
	if (locale && data.locale !== locale) return false;
	return 'governance' in data ? isPublishedContent(data) : environment === 'local' && !data.draft;
}

export function getArticleSlug(entry: { id: string; data?: object }): string {
	if (entry.data && 'slug' in entry.data && typeof entry.data.slug === 'string') return entry.data.slug;
	const parts = entry.id.split('/');
	return parts[parts.length - 1] ?? entry.id;
}
