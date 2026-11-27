import { expect, test } from '@playwright/test';

const locales = [
	{ lang: 'ar', dir: 'rtl', home: '/ar/', confirmation: '/ar/thank-you/', statusTitle: 'حالة الطلب', neutralCopy: 'لا توجد حالة طلب متاحة', returnLabel: 'العودة إلى الرئيسية' },
	{ lang: 'en', dir: 'ltr', home: '/en/', confirmation: '/en/thank-you/', statusTitle: 'Request status', neutralCopy: 'No request status is available', returnLabel: 'Back to home' },
] as const;

test.use({ javaScriptEnabled: false });

test('opens English from the root with JavaScript disabled', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL('/en/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const { lang, dir, home, confirmation, statusTitle, neutralCopy, returnLabel } of locales) {
	test(`renders neutral ${lang} confirmation without honoring URL-provided status`, async ({ page }) => {
		const response = await page.goto(`${confirmation}?status=success&email=example%40example.com`);
		expect(response?.status()).toBe(200);
		await expect(page.locator('html')).toHaveAttribute('lang', lang);
		await expect(page.locator('html')).toHaveAttribute('dir', dir);
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(statusTitle);
		await expect(page.getByRole('main')).toContainText(neutralCopy);
		await expect(page.locator('body')).not.toContainText('example@example.com');
		await expect(page.getByRole('link', { name: returnLabel })).toHaveAttribute('href', home);
		await page.getByRole('link', { name: returnLabel }).click();
		await expect(page).toHaveURL(home);
	});
}

test('serves the root missing-page experience without a redirect', async ({ page }) => {
	const response = await page.goto('/unknown-status-page/');
	expect(response?.status()).toBe(404);
	await expect(page).toHaveURL('/unknown-status-page/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText("We couldn't find that page");
	await expect(page.getByRole('link', { name: 'الرئيسية بالعربية' })).toHaveAttribute('href', '/ar/');
});

test('generates the English error artifact at the Cloudflare Workers lookup path', async ({ page }) => {
	const response = await page.goto('/en/404.html');
	expect(response?.status()).toBe(200);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText("We couldn't find that page");
	await expect(page.getByRole('main').getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en/');
	await expect(page.getByRole('link', { name: 'الرئيسية بالعربية' })).toHaveAttribute('href', '/ar/');
});
