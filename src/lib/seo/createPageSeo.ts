import type { PageSeo } from '@/lib/seo/types';

export function createPageSeo(input: PageSeo): PageSeo {
	return {
		type: 'website',
		...input,
	};
}
