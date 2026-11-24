import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleGuards, expectExactlyOneH1, expectHttpOk, setSystemColorScheme, setThemeMode, switchLanguage } from './helpers';

const CORE_CONTENT_PATHS = ['/ar/', '/en/', '/ar/articles/', '/en/articles/', '/ar/components/', '/en/components/'] as const;

test('core pages return HTTP 200 with one h1 and no console errors', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	for (const path of CORE_CONTENT_PATHS) {
		await expectHttpOk(page, path);
		await expectExactlyOneH1(page, path);
	}
	await guards.assertClean();
});

test('serves the default Arabic home with correct lang and dir', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.goto('/ar/');
	await expect(page).toHaveURL(/\/ar\/$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
	await expectExactlyOneH1(page, '/ar/');
	await expect(page.locator('#main').getByRole('link', { name: 'تصفح المقالات' })).toBeVisible();
	await expect(page.locator('#main').getByRole('link', { name: 'تصفح المكونات' })).toBeVisible();
	await guards.assertClean();
});

test('does not inject Google Analytics when Measurement ID is unset', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/en/');
	await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
	const hasGtagConfig = await page.evaluate(() => Array.from(document.scripts).some((script) => script.textContent?.includes("gtag('config'")));
	expect(hasGtagConfig).toBe(false);
	await expect(page.locator('[data-analytics-loader]')).toHaveCount(0);
	// Preference UI remains available when analytics is enabled; first-visit banner stays hidden without an ID.
	await expect(page.locator('[data-cookie-consent]')).toHaveCount(1);
	await expect(page.locator('[data-cookie-consent]')).toBeHidden();
	await expect(page.getByRole('button', { name: 'Privacy settings' })).toHaveCount(1);
	await guards.assertClean();
});

test('opts primary navigation into Astro prefetch', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.setViewportSize({ width: 1280, height: 720 });
	await expectHttpOk(page, '/en/');
	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	await expect(primaryNav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('data-astro-prefetch');
	await expect(page.locator('#main').getByRole('link', { name: 'Browse articles' })).toHaveAttribute('data-astro-prefetch');
	await guards.assertClean();
});

test('preloads only the active locale critical font variant', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/ar/');
	const arPreloads = page.locator('link[rel="preload"][as="font"]');
	await expect(arPreloads.first()).toBeAttached();
	const arCount = await arPreloads.count();
	expect(arCount).toBeGreaterThanOrEqual(1);
	expect(arCount).toBeLessThanOrEqual(2);

	await expectHttpOk(page, '/en/');
	const enPreloads = page.locator('link[rel="preload"][as="font"]');
	const enCount = await enPreloads.count();
	expect(enCount).toBeGreaterThanOrEqual(1);
	expect(enCount).toBeLessThanOrEqual(2);
	await guards.assertClean();
});

test('marks the active primary nav item with aria-current', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.setViewportSize({ width: 1280, height: 720 });
	await expectHttpOk(page, '/en/');
	const homeNav = page.getByRole('navigation', { name: 'Primary' });
	await expect(homeNav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');

	await expectHttpOk(page, '/en/articles/');
	const articlesNav = page.getByRole('navigation', { name: 'Primary' });
	await expect(articlesNav.getByRole('link', { name: 'Home', exact: true })).not.toHaveAttribute('aria-current');
	await articlesNav.getByRole('button', { name: 'Explore' }).click();
	const menuContent = articlesNav.locator('[data-slot="navigation-menu-content"]');
	await expect(menuContent.getByRole('link', { name: 'Articles', exact: true })).toHaveAttribute('aria-current', 'page');
	await expect(menuContent.getByRole('link', { name: 'Components', exact: true })).not.toHaveAttribute('aria-current');
	await guards.assertClean();
});

test('exposes a skip-to-content link and disables smooth scroll under reduced motion', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expectHttpOk(page, '/en/');
	const skip = page.getByRole('link', { name: 'Skip to content' });
	await expect(skip).toHaveAttribute('href', '#main');
	await skip.focus();
	await expect(skip).toBeFocused();

	const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
	expect(scrollBehavior).toBe('auto');
	await guards.assertClean();
});

test('opens explore dropdown and navigates to articles', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.setViewportSize({ width: 1280, height: 720 });
	await expectHttpOk(page, '/en/');
	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	await expect(primaryNav).toHaveAttribute('dir', 'ltr');
	await primaryNav.getByRole('button', { name: 'Explore' }).click();
	const menuContent = primaryNav.locator('[data-slot="navigation-menu-content"]');
	await expect(menuContent).toBeVisible();
	await menuContent.getByRole('link', { name: 'Articles', exact: true }).click();
	await expect(page).toHaveURL(/\/en\/articles\/$/);
	await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Articles');
	await expectExactlyOneH1(page, '/en/articles/');
	await guards.assertClean();
});

test('keeps Arabic explore menu right-aligned under its trigger', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await expectHttpOk(page, '/ar/');
	const primaryNav = page.getByRole('navigation', { name: 'التنقل الرئيسي' });
	await expect(primaryNav).toHaveAttribute('dir', 'rtl');
	const explore = primaryNav.getByRole('button', { name: 'استكشف' });
	await explore.click();
	const menuContent = primaryNav.locator('[data-slot="navigation-menu-content"]');
	await expect(menuContent).toBeVisible();
	const articles = menuContent.getByRole('link', { name: 'المقالات', exact: true });
	await expect(articles).toBeVisible();
	await expect(articles).toHaveCSS('text-align', /^(start|right)$/);

	const [triggerBox, linkBox] = await Promise.all([explore.boundingBox(), articles.boundingBox()]);
	expect(triggerBox).toBeTruthy();
	expect(linkBox).toBeTruthy();
	const triggerCenter = triggerBox!.x + triggerBox!.width / 2;
	const menuCenter = linkBox!.x + linkBox!.width / 2;
	expect(Math.abs(menuCenter - triggerCenter)).toBeLessThan(triggerBox!.width);
});

test('opens explore menu on narrow viewports and reaches components', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.setViewportSize({ width: 390, height: 844 });
	await expectHttpOk(page, '/ar/');

	await expect(page.getByRole('combobox', { name: 'تبديل اللغة' })).toBeVisible();
	await expect(page.getByRole('combobox', { name: 'مظهر الواجهة' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'تصفح المقالات' }).first()).toBeVisible();

	await page.getByRole('button', { name: 'القائمة' }).click();
	const sheet = page.getByRole('dialog');
	await expect(sheet).toBeVisible();
	const mobileNav = sheet.getByRole('navigation', { name: 'تنقل الجوال' });
	await expect(mobileNav).toBeVisible();
	await mobileNav.getByRole('button', { name: 'استكشف' }).click();
	const componentsLink = mobileNav.getByRole('link', { name: 'المكونات' });
	await expect(componentsLink).toBeVisible();
	await Promise.all([page.waitForURL(/\/ar\/components\/$/), componentsLink.click()]);
	await expect(page.getByRole('navigation', { name: 'مسار التنقل' })).toContainText('المكونات');
	await expectExactlyOneH1(page, '/ar/components/');
	await guards.assertClean();
});

test('switches language to English home', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/ar/');
	await switchLanguage(page, 'تبديل اللغة', 'English');
	await expect(page).toHaveURL(/\/en\/$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
	await expectExactlyOneH1(page, '/en/');
	await guards.assertClean();
});

test('navigates articles and translated article detail', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/ar/articles/');
	await expectExactlyOneH1(page, '/ar/articles/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('المقالات');
	await page.getByRole('link', { name: 'مرحبًا بقالب محتوى Astro' }).first().click();
	await expect(page).toHaveURL(/\/ar\/articles\/welcome\/$/);
	await expectExactlyOneH1(page, '/ar/articles/welcome/');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://example.com/ar/articles/welcome/');

	await switchLanguage(page, 'تبديل اللغة', 'English');
	await expect(page).toHaveURL(/\/en\/articles\/welcome\/$/);
	await expectExactlyOneH1(page, '/en/articles/welcome/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Welcome to the Astro content template');
	await guards.assertClean();
});

test('renders MDX article with allowlisted callout', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/en/articles/using-mdx/');
	await expectExactlyOneH1(page, '/en/articles/using-mdx/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Authoring with MDX');
	await expect(page.getByRole('note')).toContainText('Import only allowlisted Astro components');
	await switchLanguage(page, 'Switch language', 'العربية');
	await expect(page).toHaveURL(/\/ar\/articles\/using-mdx\/$/);
	await expect(page.getByRole('note')).toContainText('استورد مكوّنات Astro المعتمدة فقط');
	await guards.assertClean();
});

test('applies auto theme from system preference and persists manual theme', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await setSystemColorScheme(page, 'dark');
	await expectHttpOk(page, '/en/');
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'auto');
	await expect(page.locator('html')).toHaveClass(/dark/);
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

	await setThemeMode(page, 'Color theme', 'Light');
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await expect(page.getByRole('combobox', { name: 'Color theme' })).toBeVisible();

	await switchLanguage(page, 'Switch language', 'العربية');
	await expect(page).toHaveURL(/\/ar\/$/);
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'light');
	await expect(page.getByRole('combobox', { name: 'مظهر الواجهة' })).toBeVisible();

	await setThemeMode(page, 'مظهر الواجهة', 'تلقائي');
	await setSystemColorScheme(page, 'light');
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'auto');
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

	await setSystemColorScheme(page, 'dark');
	await expect(page.locator('html')).toHaveClass(/dark/);
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await guards.assertClean();
});

test('serves localized 404 metadata and RSS feed', async ({ page, request }) => {
	const guards = await attachConsoleGuards(page);
	const response = await page.goto('/ar/missing-page/');
	expect(response?.status()).toBe(404);
	await expectExactlyOneH1(page, '/ar/missing-page/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('الصفحة غير موجودة');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

	const rss = await request.get('/rss.xml');
	expect(rss.ok()).toBeTruthy();
	const body = await rss.text();
	expect(body).toContain('Welcome to the Astro content template');
	expect(body).toContain('مرحبًا بقالب محتوى Astro');
	expect(body).not.toContain('Draft that must stay hidden');
	await guards.assertClean();
});

test('renders bilingual component catalog with interactive demos', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/ar/components/');
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
	await expectExactlyOneH1(page, '/ar/components/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('كتالوج المكونات');
	await expect(page.locator('[data-catalog-component]')).toHaveCount(35);

	await page.locator('[data-catalog-component="tabs"]').getByRole('tab', { name: 'الاستخدام' }).click();
	await expect(page.locator('[data-catalog-component="tabs"]').getByRole('tabpanel')).toContainText('client:idle');

	const stepper = page.locator('[data-catalog-component="stepper"]');
	await expect(stepper.locator('[data-stepper-status]')).toHaveText('الخطوة 1 من 3');
	await stepper.getByRole('button', { name: 'التالي' }).click();
	await expect(stepper.locator('[data-stepper-status]')).toHaveText('الخطوة 2 من 3');

	await page.locator('[data-catalog-component="toast"]').getByRole('button').click();
	await expect(page.locator('[data-sonner-toast]')).toContainText('إشعار الكتالوج');

	await page.locator('[data-catalog-component="alert-dialog"]').getByRole('button').click();
	await expect(page.getByRole('alertdialog')).toBeVisible();
	await page.getByRole('button', { name: 'إلغاء' }).click();

	const comboboxTrigger = page.locator('[data-catalog-component="combobox"]').getByRole('button');
	await comboboxTrigger.click();
	await page.getByRole('listbox').getByRole('option', { name: 'الإمارات العربية المتحدة' }).click();
	await expect(comboboxTrigger).toHaveAccessibleName(/الإمارات العربية المتحدة/);

	await switchLanguage(page, 'تبديل اللغة', 'English');
	await expect(page).toHaveURL(/\/en\/components\/$/);
	await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Component catalog');
	await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Components');

	await page.locator('[data-catalog-component="alert-dialog"]').getByRole('button').click();
	await expect(page.getByRole('alertdialog')).toBeVisible();
	await page.getByRole('button', { name: 'Cancel' }).click();

	await comboboxTrigger.click();
	await page.getByRole('listbox').getByRole('option', { name: 'United Arab Emirates' }).click();
	await expect(comboboxTrigger).toHaveAccessibleName(/United Arab Emirates/);

	const primaryNav = page.getByRole('navigation', { name: 'Primary' });
	await primaryNav.getByRole('button', { name: 'Explore' }).click();
	await expect(primaryNav.getByRole('link', { name: 'Components' })).toBeVisible();

	await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
	await setThemeMode(page, 'Color theme', 'Dark');
	await expect(page.locator('html')).toHaveClass(/dark/);

	await page.locator('[data-catalog-component="sheet"]').getByRole('button').click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.getByRole('button', { name: 'Cancel' }).click();
	await guards.assertClean();
});

test('opts into native cross-document view transitions without ClientRouter', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/en/');

	const optIn = await page.evaluate(() => {
		for (const sheet of Array.from(document.styleSheets)) {
			try {
				for (const rule of Array.from(sheet.cssRules)) {
					const text = rule.cssText;
					if (text.includes('@view-transition') && text.includes('navigation: auto')) {
						return true;
					}
				}
			} catch {
				// Cross-origin stylesheets are not readable.
			}
		}
		return false;
	});
	expect(optIn).toBe(true);

	await expect(page.locator('astro-client-router, [data-astro-transition-persist]')).toHaveCount(0);

	await page.locator('#main').getByRole('link', { name: 'Browse articles' }).click();
	await expect(page).toHaveURL(/\/en\/articles\/$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://example.com/en/articles/');

	await setThemeMode(page, 'Color theme', 'Dark');
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
	await expect(page.locator('html')).toHaveClass(/dark/);

	await switchLanguage(page, 'Switch language', 'العربية');
	await expect(page).toHaveURL(/\/ar\/articles\/$/);
	await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
	await expect(page.locator('html')).toHaveAttribute('data-theme-mode', 'dark');
	await expect(page.locator('html')).toHaveClass(/dark/);
	await expect(page.getByRole('combobox', { name: 'مظهر الواجهة' })).toBeVisible();
	await guards.assertClean();
});

test('navigates under reduced motion with view-transition animations disabled', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expectHttpOk(page, '/ar/');

	const stylesheetHref = await page.locator('link[rel="stylesheet"]').first().getAttribute('href');
	expect(stylesheetHref).toBeTruthy();
	const cssText = await (await page.request.get(stylesheetHref!)).text();
	expect(cssText).toMatch(/prefers-reduced-motion\s*:\s*no-preference[\s\S]*?@view-transition\s*\{\s*navigation\s*:\s*auto/);
	expect(cssText).toMatch(/prefers-reduced-motion\s*:\s*reduce[\s\S]*?::view-transition-(?:group|old|new)\([\s\S]*?animation\s*:\s*none/);

	await page.locator('#main').getByRole('link', { name: 'تصفح المقالات' }).click();
	await expect(page).toHaveURL(/\/ar\/articles\/$/);
	await expectExactlyOneH1(page, '/ar/articles/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('المقالات');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
	await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
	await guards.assertClean();
});

test('has no automatically detectable accessibility violations in both locales', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	for (const path of ['/ar/', '/en/articles/using-mdx/', '/en/articles/']) {
		await expectHttpOk(page, path);
		await expectExactlyOneH1(page, path);
		// Scope to main: header CTA uses small primary text that sits near AA with brand tokens.
		const results = await new AxeBuilder({ page }).include('#main').analyze();
		expect(results.violations, `${path} accessibility violations`).toEqual([]);
	}

	for (const locale of ['ar', 'en']) {
		for (const colorScheme of ['light', 'dark'] as const) {
			await page.emulateMedia({ colorScheme });
			await expectHttpOk(page, '/' + locale + '/components/');
			const results = await new AxeBuilder({ page }).analyze();
			expect(results.violations, locale + ' ' + colorScheme + ' catalog').toEqual([]);
			await page.locator('[data-catalog-component="alert-dialog"]').getByRole('button').click();
			const dialog = page.getByRole('alertdialog');
			await expect(dialog).toBeVisible();
			const openDialogResults = await new AxeBuilder({ page }).analyze();
			expect(openDialogResults.violations, locale + ' ' + colorScheme + ' open dialog').toEqual([]);
			await page.keyboard.press('Escape');
			await expect(dialog).toHaveCount(0);
		}
	}
	await guards.assertClean();
});

test('exposes SEO metadata and blocks indexing in preview', async ({ page, request }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/en/articles/welcome/');
	await expectExactlyOneH1(page, '/en/articles/welcome/');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://example.com/en/articles/welcome/');
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://example.com/images/og/default.png');
	await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://example.com/images/og/default.png');
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
	await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', /.+/);
	await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', /.+/);
	await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
	await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');

	const jsonLdScripts = page.locator('script[type="application/ld+json"]');
	await expect(jsonLdScripts).toHaveCount(2);
	const payloads = await jsonLdScripts.evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? '{}')));
	expect(payloads.some((entry) => entry['@type'] === 'Article')).toBe(true);
	expect(payloads.some((entry) => entry['@type'] === 'BreadcrumbList')).toBe(true);

	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBeTruthy();
	const robotsBody = await robots.text();
	expect(robotsBody).toContain('Allow: /');
	expect(robotsBody).not.toContain('Sitemap:');

	const sitemap = await request.get('/sitemap-index.xml');
	expect(sitemap.status()).toBe(404);
	await expect(page.locator('link[rel="sitemap"]')).toHaveCount(0);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

	await guards.assertClean();
});

test('keeps trailing-slash public URLs and secure external footer links', async ({ page }) => {
	const guards = await attachConsoleGuards(page);
	await expectHttpOk(page, '/en/articles/');
	await expect(page).toHaveURL(/\/en\/articles\/$/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://example.com/en/articles/');

	const internalHrefs = await page.locator('a[href^="/"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href') ?? ''));
	expect(internalHrefs.every((href) => href.includes('.') || href.endsWith('/'))).toBe(true);

	await expectHttpOk(page, '/en/');
	const external = page.locator('footer a[href^="http"]').first();
	await expect(external).toHaveAttribute('target', '_blank');
	await expect(external).toHaveAttribute('rel', /noopener/);
	await expect(external).toHaveAttribute('rel', /noreferrer/);
	await guards.assertClean();
});

for (const [locale, messages] of [
	['ar', ['أدخل حرفين على الأقل.', 'أدخل بريدًا إلكترونيًا صالحًا.', 'أدخل 8 أحرف على الأقل.']],
	['en', ['Enter at least 2 characters.', 'Enter a valid email address.', 'Enter at least 8 characters.']],
] as const) {
	test(`validates, submits and resets the ${locale} catalog form`, async ({ page }) => {
		await expectHttpOk(page, `/${locale}/components/`);
		const form = page.locator('astro-island:not([ssr]) [data-catalog-component="form"] form');
		const submit = form.getByRole('button');
		const fields = form.getByRole('textbox');
		await fields.nth(1).fill('invalid-email');
		await submit.click();
		for (const [index, message] of messages.entries()) {
			const error = form.getByText(message, { exact: true });
			await expect(error).toBeVisible();
			await expect(error.locator('..')).toHaveAttribute('aria-live', 'polite');
			await expect(fields.nth(index)).toHaveAttribute('aria-invalid', 'true');
			const descriptions = (await fields.nth(index).getAttribute('aria-describedby'))?.split(' ');
			expect(descriptions).toContain(await error.getAttribute('id'));
			for (const id of descriptions ?? []) await expect(form.locator('[id="' + id + '"]')).toHaveCount(1);
		}
		await fields.nth(0).fill('Template Tester');
		await fields.nth(1).fill('tester@example.com');
		await fields.nth(2).fill('A valid test message.');
		await submit.click();
		await expect(page.locator('[data-sonner-toast]')).toBeVisible();
		for (const field of await fields.all()) await expect(field).toHaveValue('');
		for (const message of messages) await expect(form.getByText(message, { exact: true })).toHaveCount(0);
	});
}

for (const locale of ['ar', 'en']) {
	test(`searches the ${locale} combobox and returns focus after Escape`, async ({ browser, baseURL }) => {
		const context = await browser.newContext({ baseURL: baseURL!, hasTouch: true, viewport: { width: 390, height: 720 } });
		try {
			const page = await context.newPage();
			await expectHttpOk(page, `/${locale}/components/`);
			const trigger = page.locator('astro-island:not([ssr]) [data-catalog-component="combobox"] button').first();
			await trigger.tap();
			const input = page.locator('[data-slot="combobox-input"]');
			await expect(input).toHaveAccessibleName(/\S/);
			await input.fill('zz-no-results-zz');
			await expect(page.locator('[data-slot="combobox-empty"][role="status"]')).toBeVisible();
			await input.press('Escape');
			await expect(input).toBeHidden();
			await expect(trigger).toBeFocused();
			await trigger.press('Enter');
			await input.fill(locale === 'ar' ? 'مصر' : 'Egypt');
			await input.press('ArrowDown');
			await input.press('Enter');
			await expect(trigger).toHaveAccessibleName(locale === 'ar' ? /مصر/ : /Egypt/);
			await expect(input).toBeHidden();
			const dialogTrigger = page.locator('[data-catalog-component="alert-dialog"]').getByRole('button');
			await dialogTrigger.tap();
			await expect(page.getByRole('alertdialog')).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(page.getByRole('alertdialog')).toHaveCount(0);
			await expect(dialogTrigger).toBeFocused();
		} finally {
			await context.close();
		}
	});
}
