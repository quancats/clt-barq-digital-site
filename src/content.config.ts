import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
	loader: glob({
		base: './src/content/articles',
		pattern: '**/*.{md,mdx}',
	}),
	schema: z.object({
		locale: z.enum(['ar', 'en']),
		translationGroup: z.string().min(1),
		title: z.string().min(1),
		description: z.string().min(1),
		publishedAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		draft: z.boolean().default(false),
		image: z.string().optional(),
	}),
});

export const collections = { articles };
