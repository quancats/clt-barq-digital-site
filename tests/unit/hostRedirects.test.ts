import { describe, expect, it } from 'vitest';
import { renderHostRedirects } from '@/data/hostRedirects.mjs';

describe('published legacy redirects', () => {
	it('redirects the root to English and migrates existing Arabic destinations', () => {
		const available = ['/ar/', '/en/', '/ar/insights/articles/', '/ar/about/'];
		const rules = renderHostRedirects(available).trim().split('\n');
		expect(rules).toEqual(expect.arrayContaining(['/ /en/ 302', '/about/ /ar/about/ 301', '/about /ar/about/ 301', '/home/ /ar/ 301', '/blog/ /ar/insights/articles/ 301', '/ar /ar/ 301', '/en /en/ 301']));
		expect(rules.some((rule) => rule.startsWith('/ar/ ') || rule.startsWith('/en/ ') || rule.includes('/en/insights/articles/') || rule.includes('/ar/services/'))).toBe(false);
	});
});
