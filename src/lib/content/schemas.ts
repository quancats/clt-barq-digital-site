import { z } from 'astro/zod';
import { locales } from '@/i18n/config';

const locale = z.enum(locales);
const text = z.string().trim().min(1);
const key = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const slug = z
	.string()
	.normalize()
	.regex(/^[\p{Ll}\p{Lo}\p{N}][\p{Ll}\p{Lo}\p{M}\p{N}]*(?:-[\p{Ll}\p{Lo}\p{N}][\p{Ll}\p{Lo}\p{M}\p{N}]*)*$/u);
const safeFileName = '[a-zA-Z0-9_-]+(?:\\.[a-zA-Z0-9_-]+)*';
const imagesPath = z.string().regex(new RegExp(`^/images/(?:${safeFileName}/)*${safeFileName}\\.(?:avif|gif|jpe?g|png|webp)$`, 'i'));
const downloadPath = z.string().regex(new RegExp(`^/downloads/(?:${safeFileName}/)*${safeFileName}\\.pdf$`, 'i'));
const editorAsset = z.strictObject({
	path: imagesPath,
	alt: text,
	usageRef: key,
	caption: text.optional(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	variants: z.array(z.strictObject({ path: imagesPath, width: z.number().int().positive() })).optional(),
});
const resourceFile = z.strictObject({
	path: downloadPath,
	label: text,
	locale,
	usageRef: key,
});
const date = z.union([z.date(), z.iso.date(), z.iso.datetime({ offset: true })]).pipe(z.coerce.date());
const governance = z.discriminatedUnion('status', [z.strictObject({ status: z.literal('published'), approvalRef: key }), z.strictObject({ status: z.enum(['draft', 'review', 'archived']), approvalRef: key.optional() })]);

const common = {
	contentId: key,
	translationKey: key,
	locale,
	slug,
	title: text,
	description: text,
	governance,
	featured: z.boolean().default(false),
	sortOrder: z.number().int().nonnegative().default(0),
	seo: z.strictObject({ title: text, description: text }).optional(),
	media: z.array(editorAsset).default([]),
};
const references = z.array(key).default([]);
const faq = z.array(z.strictObject({ question: text, answer: text })).optional();
const httpsUrl = z.url({ protocol: /^https$/ });
const availability = z.enum(['released', 'conditional', 'roadmap']);
const sections = z.array(z.strictObject({ key, title: text, body: text }));
const editorial = {
	publishedAt: date,
	updatedAt: date.optional(),
	tags: z.array(key).default([]),
	category: key,
	author: key.optional(),
};

const article = z.strictObject({
	...common,
	...editorial,
});
const previewArticle = z.strictObject({
	locale,
	translationGroup: key,
	title: text,
	description: text,
	publishedAt: date,
	updatedAt: date.optional(),
	draft: z.boolean().default(false),
	image: imagesPath.optional(),
});

export const contentSchemas = {
	pages: z.strictObject({
		...common,
		sections: sections.min(1),
		contactLinks: z.array(z.strictObject({ label: text, href: z.string().regex(/^(?:mailto:[^\s?<>@]+@[^\s?<>@]+|tel:\+?[0-9][0-9()-]*)$/) })).optional(),
		profile: resourceFile.optional(),
	}),
	products: z.strictObject({
		...common,
		features: z.array(z.strictObject({ key, title: text, description: text, availability })).min(1),
		availability,
		solutions: references,
		officialUrl: httpsUrl.optional(),
		brand: text.optional(),
		platforms: z.array(z.strictObject({ name: text, availability, url: httpsUrl.optional() })).optional(),
		useCases: z.array(text).optional(),
		sections: sections.optional(),
		externalLinks: z.array(z.strictObject({ label: text, href: httpsUrl })).optional(),
		faq,
	}),
	services: z.strictObject({
		...common,
		scope: z.array(text).min(1),
		deliverables: z.array(text).min(1),
		category: text.optional(),
		faq,
		solutions: references,
		products: references,
		sections: sections.optional(),
	}),
	solutions: z.strictObject({
		...common,
		problem: text,
		products: references,
		services: references,
		projects: references,
		sections: sections.optional(),
	}),
	industries: z.strictObject({
		...common,
		needs: z.array(text).min(1),
		limitations: z.array(text).default([]),
		solutions: references,
		services: references,
		products: references,
		projects: references,
		sections: sections.optional(),
	}),
	projects: z.strictObject({
		...common,
		kind: z.enum(['owned-product', 'client-project', 'case-study']),
		role: text,
		scope: text,
		results: z.array(text).default([]),
		services: references,
		solutions: references,
		products: references,
	}),
	articles: z.union([article, previewArticle]),
	news: z.strictObject({ ...common, ...editorial }),
	resources: z.strictObject({ ...common, file: resourceFile }),
	authors: z.strictObject({ ...common, bio: text }),
	legal: z.strictObject({ ...common, revision: key, effectiveDate: date }),
};
