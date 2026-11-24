export const layout = {
	nav_label: 'Primary',
	nav_mobile_label: 'Mobile',
	nav_menu: 'Menu',
	nav_home: 'Home',
	nav_explore: 'Explore',
	nav_articles: 'Articles',
	nav_components: 'Components',
	header_cta: 'Browse articles',
	breadcrumbs_label: 'Breadcrumb',
	footer_note: 'A static bilingual template aligned with Astro standards.',
	footer_nav_label: 'Footer',
	footer_social_label: 'Social links',
	footer_copyright: '© {year} {brand}. All rights reserved.',
	footer_made_with: 'Made with ❤ in',
	footer_made_with_brand: 'Quancats',
	footer_columns: [
		{
			title: 'Explore',
			links: [
				{ label: 'Home', path: '/' },
				{ label: 'Articles', path: '/articles' },
				{ label: 'Components', path: '/components' },
			],
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Articles', path: '/articles' },
				{ label: 'Component catalog', path: '/components' },
				{ label: 'Authoring with MDX', path: '/articles/using-mdx' },
			],
		},
		{
			title: 'Project',
			links: [
				{ label: 'Home', path: '/' },
				{ label: 'Articles', path: '/articles' },
				{ label: 'Components', path: '/components' },
			],
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Terms of service', path: '#' },
				{ label: 'Privacy policy', path: '#' },
				{ label: 'License', path: '#' },
			],
		},
	],
	footer_social: [
		{ label: 'Facebook', href: '#' },
		{ label: 'Instagram', href: '#' },
		{ label: 'X', href: '#' },
		{ label: 'GitHub', href: '#' },
		{ label: 'YouTube', href: '#' },
	],
} as const;
