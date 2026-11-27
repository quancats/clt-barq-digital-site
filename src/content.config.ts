import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales } from './i18n/config';
import { contentSchemas } from './lib/content/schemas';

function localLoader(name: keyof typeof contentSchemas) {
	return glob({
		base: './src/content',
		pattern: `${name}/**/*.${name === 'articles' ? '{md,mdx}' : '{md,json,yaml,yml}'}`,
		// Keep file identities distinct so validation can report duplicated public slugs.
		generateId: ({ entry, data }) => {
			const relativePath = entry.slice(name.length + 1);
			return name === 'articles' && typeof data.translationGroup === 'string' ? relativePath.replace(/\.[^.]+$/, '') : relativePath;
		},
	});
}

export const collections = {
	review: defineCollection({
		loader: glob({ base: './src/content/review', pattern: '**/*.md' }),
		schema: z.strictObject({
			id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
			translationKey: z.string().min(1),
			locale: z.enum(locales),
			route: z.string().startsWith('/').optional(),
			section: z.string().min(1),
			title: z.string().min(1),
			description: z.string().min(1).optional(),
			status: z.literal('draft'),
			reviewStatus: z.enum(['review', 'review-service', 'review-solution', 'review-industry', 'review-editorial', 'hold-legal', 'hold-until-launch']),
			seoTitle: z.string().min(1).optional(),
			seoDescription: z.string().min(1).optional(),
			indexableAfterApproval: z.boolean(),
			sortOrder: z.number().int().nonnegative(),
		}),
	}),
	pages: defineCollection({ loader: localLoader('pages'), schema: contentSchemas.pages }),
	products: defineCollection({ loader: localLoader('products'), schema: contentSchemas.products }),
	services: defineCollection({ loader: localLoader('services'), schema: contentSchemas.services }),
	solutions: defineCollection({ loader: localLoader('solutions'), schema: contentSchemas.solutions }),
	industries: defineCollection({ loader: localLoader('industries'), schema: contentSchemas.industries }),
	projects: defineCollection({ loader: localLoader('projects'), schema: contentSchemas.projects }),
	articles: defineCollection({ loader: localLoader('articles'), schema: contentSchemas.articles }),
	news: defineCollection({ loader: localLoader('news'), schema: contentSchemas.news }),
	resources: defineCollection({ loader: localLoader('resources'), schema: contentSchemas.resources }),
	authors: defineCollection({ loader: localLoader('authors'), schema: contentSchemas.authors }),
	legal: defineCollection({ loader: localLoader('legal'), schema: contentSchemas.legal }),
};
