import { localizePath, type Locale } from '@/i18n/config';
import { getEditorialNavigation } from '@/lib/content/queries/getEditorialPaths';
import { getSiteSections } from '@/lib/content/queries/getSiteRoutes';

export async function getCorporateNavigation(locale: Locale) {
	const [sections, editorial] = await Promise.all([getSiteSections(locale), getEditorialNavigation(locale)]);
	const pick = (keys: string[]) => keys.flatMap((key) => sections.filter((section) => section.key === key));
	const ar = locale === 'ar';
	const labels: Record<string, string> = ar ? { about: 'من نحن', projects: 'أعمالنا', partners: 'الشراكات', faq: 'الأسئلة الشائعة', contact: 'تواصل معنا', consultation: 'اطلب استشارة', demo: 'اطلب عرض BIM' } : { about: 'About us', projects: 'Our work', partners: 'Partnerships', faq: 'FAQ', contact: 'Contact us', consultation: 'Request a consultation', demo: 'Request a BIM demo' };
	const withLabels = (keys: string[]) => pick(keys).map((link) => ({ ...link, title: labels[link.key] ?? link.title }));
	const home = { key: 'home', href: localizePath(locale, '/'), title: ar ? 'الرئيسية' : 'Home' };
	const [contact] = withLabels(['contact']);
	const groups = [
		{ title: ar ? 'الشركة' : 'Company', links: withLabels(['about', 'projects', 'partners', 'faq']) },
		{ title: ar ? 'قدراتنا' : 'Capabilities', links: pick(['products', 'services', 'solutions', 'industries']) },
		{ title: ar ? 'المعرفة' : 'Knowledge', links: editorial },
		{ title: ar ? 'تواصل معنا' : 'Contact us', links: withLabels(['contact', 'consultation', 'demo']) },
	];

	return { home, contact, groups, legal: pick(['privacy', 'terms']) };
}
