import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fixture = process.argv[2];
if (!fixture || !/ms-027-040-fixture$/.test(fixture)) throw new Error('Supply the isolated ms-027-040-fixture directory.');
const contentRoot = resolve(fixture, 'src/content');

function write(collection, key, locale, data, body) {
	const directory = resolve(contentRoot, collection);
	mkdirSync(directory, { recursive: true });
	const title = locale === 'ar' ? `محتوى اصطناعي ${key}` : `Synthetic ${key}`;
	const metadata = {
		contentId: `ms-fixture-${key}-${locale}`,
		translationKey: key,
		slug: key,
		locale,
		title,
		description: locale === 'ar' ? `وصف اصطناعي لاختبار مسار ${key} محليًا.` : `Synthetic copy to verify the ${key} route locally.`,
		governance: { status: 'published', approvalRef: 'synthetic-local-verification' },
		...data,
	};
	const file = resolve(directory, `ms-fixture-${key}-${locale}`);
	if (body) writeFileSync(`${file}.md`, `---\n${JSON.stringify(metadata)}\n---\n\n${body}\n`, { flag: 'wx' });
	else writeFileSync(`${file}.json`, JSON.stringify(metadata), { flag: 'wx' });
}

for (const locale of ['ar', 'en']) {
	const ar = locale === 'ar';
	const body = ar ? 'بيانات اصطناعية للتحقق المحلي.' : 'Synthetic data for local verification.';
	const sections = [{ key: 'fixture-section', title: ar ? 'قسم اصطناعي' : 'Fixture section', body }];
	for (const key of ['home', 'contact', 'consultation', 'demo', 'partners', 'insights']) write('pages', key, locale, { sections });
	write('legal', 'privacy', locale, { revision: 'local-fixture', effectiveDate: '2026-01-01' }, body);
	write('services', 'fixture-service', locale, { scope: [body], deliverables: [body] });
	write('products', 'bim', locale, {
		availability: 'released',
		features: [{ key: 'fixture-feature', title: ar ? 'ميزة اصطناعية' : 'Fixture feature', description: body, availability: 'released' }],
		officialUrl: 'https://example.invalid/bim',
	});
	write('articles', 'fixture-article', locale, { category: 'fixture', categoryLabel: ar ? 'تصنيف اصطناعي' : 'Fixture category', publishedAt: '2026-01-01' }, body);
}
