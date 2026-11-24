import { describe, expect, it } from 'vitest';
import { getArticleSlug, isPublicArticle } from '@/lib/content/queries/articleHelpers';

describe('article helpers', () => {
	it('excludes drafts from public output', () => {
		expect(isPublicArticle({ draft: true, locale: 'ar' })).toBe(false);
		expect(isPublicArticle({ draft: false, locale: 'ar' }, 'en')).toBe(false);
		expect(isPublicArticle({ draft: false, locale: 'ar' }, 'ar')).toBe(true);
	});

	it('reads the slug from collection ids', () => {
		expect(getArticleSlug({ id: 'ar/welcome' })).toBe('welcome');
		expect(getArticleSlug({ id: 'welcome' })).toBe('welcome');
	});
});
