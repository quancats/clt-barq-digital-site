import { describe, expect, it } from 'vitest';
import { getLocalizedPublicationRoutes, validatePublication, type PublicationCandidate } from '@/lib/content/publication';
import { getArticleSlug, isPublicArticle } from '@/lib/content/queries/articleHelpers';
import { contentSchemas } from '@/lib/content/schemas';

const approved = { status: 'published', approvalRef: 'decision-1' } as const;

const arabic = {
	sourceId: 'ar/safe.md',
	collection: 'services',
	contentId: 'safe-ar',
	translationKey: 'safe',
	locale: 'ar',
	slug: 'آمن',
	governance: approved,
} satisfies PublicationCandidate;

const english = {
	...arabic,
	sourceId: 'en/safe.md',
	contentId: 'safe-en',
	locale: 'en',
	slug: 'secure',
} satisfies PublicationCandidate;

const assetExists = (path: string) => path === '/images/approved.webp';

describe('content publication', () => {
	it('validates approved bilingual entries and emits only their translated slugs', () => {
		const entries = [arabic, english, { ...english, collection: 'articles', contentId: 'review-en', governance: { status: 'review' as const } }];
		expect(() => validatePublication(entries, assetExists)).not.toThrow();
		expect([...getLocalizedPublicationRoutes(entries)]).toEqual([['services/safe', { ar: 'آمن', en: 'secure' }]]);
	});

	it('rejects duplicates in IDs, locale slugs and locale translation keys', () => {
		expect(() => validatePublication([arabic, english, { ...english, sourceId: 'en/another.md' }], assetExists)).toThrow(/duplicate content ID safe-en[\s\S]*duplicate services\/en slug secure[\s\S]*duplicate services\/en translation key safe/);
	});

	it('reserves the same BIM flagship slug in both locales', () => {
		const product = (entry: PublicationCandidate) => ({ ...entry, collection: 'products', translationKey: 'bim', slug: 'bim' });
		const products = [product(arabic), product(english)];
		expect(() => validatePublication(products, assetExists)).not.toThrow();
		expect(() => validatePublication([{ ...product(arabic), slug: 'flagship' }, product(english)], assetExists)).toThrow(/reserved bim product slug/);
		expect(() =>
			validatePublication(
				products.map((entry) => ({ ...entry, translationKey: 'other' })),
				assetExists,
			),
		).toThrow(/reserved bim product slug/);
	});

	it('rejects required translations and relations when the target locale is unapproved', () => {
		const entries = [
			{ ...arabic, relations: [{ collection: 'projects', translationKey: 'case' }] },
			{ ...english, governance: { status: 'review' as const } },
			{ ...english, collection: 'projects', translationKey: 'case', contentId: 'case-en' },
		];
		expect(() => validatePublication(entries, assetExists)).toThrow(/services\/ar\/safe.md: missing approved en translation[\s\S]*projects\/case has no approved ar entry/);
	});

	it('requires asset files and approval references on published content', () => {
		expect(() => validatePublication([{ ...arabic, assets: ['/images/approved.webp'] }, english], assetExists)).not.toThrow();
		expect(() => validatePublication([{ ...arabic, assets: ['/images/missing.webp'] }, english], assetExists)).toThrow(/missing public asset/);
		expect(() => validatePublication([{ ...arabic, governance: { status: 'published' } }, english], assetExists)).toThrow(/requires an approval reference/);
		expect(() => validatePublication([{ ...arabic, governance: { status: 'draft' }, assets: ['/images/approved.webp'] }], assetExists)).toThrow(/non-public content links to a public asset/);
	});

	it('keeps starter articles local, excludes drafts and preserves explicit localized slugs', () => {
		const starter = { locale: 'ar', draft: false } as const;
		expect(isPublicArticle(starter, 'ar', 'local')).toBe(true);
		expect(isPublicArticle(starter, 'ar', 'staging')).toBe(false);
		expect(isPublicArticle(starter, 'ar', 'production')).toBe(false);
		expect(isPublicArticle({ ...starter, draft: true }, 'ar', 'local')).toBe(false);
		expect(isPublicArticle(arabic, 'ar', 'production')).toBe(true);
		expect(getArticleSlug({ id: 'ar/opinion.md', data: { slug: 'رأي' } })).toBe('رأي');
	});

	it('requires localized text, approval and rights for assets and rejects unsafe paths', () => {
		const base = {
			contentId: arabic.contentId,
			translationKey: arabic.translationKey,
			locale: arabic.locale,
			slug: arabic.slug,
			governance: approved,
			title: 'خدمة',
			description: 'وصف الخدمة',
		};
		const service = { ...base, scope: ['استشارة'], deliverables: ['تقرير'] };
		const valid = { ...service, media: [{ path: '/images/approved.webp', alt: 'صورة توضيحية', usageRef: 'rights-1' }] };
		expect(contentSchemas.services.safeParse(valid).success).toBe(true);
		expect(contentSchemas.services.safeParse({ ...service, title: '  ' }).success).toBe(false);
		expect(contentSchemas.services.safeParse({ ...service, governance: { status: 'published' } }).success).toBe(false);
		expect(contentSchemas.services.safeParse({ ...service, media: [{ path: '/images/../private.webp', alt: 'صورة', usageRef: 'rights-1' }] }).success).toBe(false);
		expect(contentSchemas.services.safeParse({ ...service, media: [{ path: '/images/approved.webp', alt: ' ' }] }).success).toBe(false);
		const download = { path: '/downloads/guide.pdf', locale: 'ar', label: 'دليل', usageRef: 'rights-1' };
		expect(contentSchemas.resources.safeParse({ ...base, file: download }).success).toBe(true);
		expect(contentSchemas.resources.safeParse({ ...base, file: { ...download, path: '/downloads/guide.html' } }).success).toBe(false);
	});
});
