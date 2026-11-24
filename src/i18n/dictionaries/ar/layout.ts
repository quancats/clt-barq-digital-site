export const layout = {
	nav_label: 'التنقل الرئيسي',
	nav_mobile_label: 'تنقل الجوال',
	nav_menu: 'القائمة',
	nav_home: 'الرئيسية',
	nav_explore: 'استكشف',
	nav_articles: 'المقالات',
	nav_components: 'المكونات',
	header_cta: 'تصفح المقالات',
	breadcrumbs_label: 'مسار التنقل',
	footer_note: 'قالب ثابت ثنائي اللغة مبني على معايير Astro.',
	footer_nav_label: 'تذييل الصفحة',
	footer_social_label: 'روابط التواصل',
	footer_copyright: '© {year} {brand}. جميع الحقوق محفوظة.',
	footer_made_with: 'صُنع بـ ❤ في',
	footer_made_with_brand: 'Quancats',
	footer_columns: [
		{
			title: 'استكشف',
			links: [
				{ label: 'الرئيسية', path: '/' },
				{ label: 'المقالات', path: '/articles' },
				{ label: 'المكونات', path: '/components' },
			],
		},
		{
			title: 'موارد',
			links: [
				{ label: 'المقالات', path: '/articles' },
				{ label: 'كتالوج المكونات', path: '/components' },
				{ label: 'التأليف بـ MDX', path: '/articles/using-mdx' },
			],
		},
		{
			title: 'المشروع',
			links: [
				{ label: 'الرئيسية', path: '/' },
				{ label: 'المقالات', path: '/articles' },
				{ label: 'المكونات', path: '/components' },
			],
		},
		{
			title: 'قانوني',
			links: [
				{ label: 'شروط الخدمة', path: '#' },
				{ label: 'سياسة الخصوصية', path: '#' },
				{ label: 'الترخيص', path: '#' },
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
