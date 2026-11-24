import type { APIRoute } from 'astro';
import { ENV, PREVIEW_CRAWL_POLICY, PUBLIC_SITE_URL } from 'astro:env/server';
import { isSiteIndexable } from '@/lib/seo/indexingPolicy';
import { createRobotsTxt } from '@/lib/seo/robots';

export const GET: APIRoute = ({ site }) => {
	const origin = site ?? new URL(PUBLIC_SITE_URL);
	const indexable = isSiteIndexable(ENV, PUBLIC_SITE_URL);
	return new Response(createRobotsTxt({ origin, indexable, privatePreview: PREVIEW_CRAWL_POLICY === 'private' }), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
