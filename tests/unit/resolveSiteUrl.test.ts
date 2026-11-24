import { afterEach, describe, expect, it, vi } from 'vitest';
import { FALLBACK_SITE_URL, resolveSiteUrl } from '@/lib/env/resolveSiteUrl';

describe('resolveSiteUrl', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	it('falls back to example.com when unset', () => {
		expect(resolveSiteUrl('')).toBe(FALLBACK_SITE_URL);
		expect(resolveSiteUrl({})).toBe(FALLBACK_SITE_URL);
	});

	it('returns the origin for a valid absolute URL', () => {
		expect(resolveSiteUrl('https://quanizon.com/path')).toBe('https://quanizon.com');
	});

	it('strips surrounding quotes from values', () => {
		expect(resolveSiteUrl('"https://quanizon.com"')).toBe('https://quanizon.com');
		expect(resolveSiteUrl("'https://quanizon.com/'")).toBe('https://quanizon.com');
	});

	it('rejects non-http protocols', () => {
		expect(() => resolveSiteUrl('ftp://example.com')).toThrow(/http or https/);
	});

	it('rejects invalid URLs', () => {
		expect(() => resolveSiteUrl('not-a-url')).toThrow(/absolute URL/);
	});

	it('prefers process PUBLIC_SITE_URL over file values', () => {
		expect(
			resolveSiteUrl({
				processPublicSiteUrl: 'https://from-process.example',
				filePublicSiteUrl: 'https://from-file.example',
			}),
		).toBe('https://from-process.example');
	});

	it('uses file PUBLIC_SITE_URL when process env is unset', () => {
		expect(
			resolveSiteUrl({
				filePublicSiteUrl: 'https://from-file.example/path',
			}),
		).toBe('https://from-file.example');
	});
});
