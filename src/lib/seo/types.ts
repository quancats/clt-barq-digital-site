export interface PageSeo {
	title: string;
	description: string;
	canonicalPath: string;
	image?: string | undefined;
	type?: 'website' | 'article' | undefined;
	noindex?: boolean | undefined;
	publishedAt?: Date | undefined;
	updatedAt?: Date | undefined;
}

export interface LocaleAlternate {
	locale: string;
	href: string;
}
