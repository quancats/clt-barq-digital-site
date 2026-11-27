import { expect, test } from '@playwright/test';
import { attachConsoleGuards, expectHttpOk, expectNoHorizontalOverflow } from './helpers';

const VIEWPORTS = [
	{ name: 'short-mobile', width: 320, height: 220 },
	{ name: 'mobile', width: 390, height: 844 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 720 },
] as const;

const ROUTES = [
	{ path: '/ar/', dir: 'rtl', lang: 'ar' },
	{ path: '/en/', dir: 'ltr', lang: 'en' },
	{ path: '/ar/products/bim/', dir: 'rtl', lang: 'ar' },
	{ path: '/ar/projects/bim-product/', dir: 'rtl', lang: 'ar' },
	{ path: '/en/products/bim/', dir: 'ltr', lang: 'en' },
	{ path: '/en/projects/bim-product/', dir: 'ltr', lang: 'en' },
] as const;

for (const viewport of VIEWPORTS) {
	for (const route of ROUTES) {
		test(`no horizontal overflow @ ${viewport.name} ${route.path}`, async ({ page }) => {
			const guards = await attachConsoleGuards(page);
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await expectHttpOk(page, route.path);
			await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
			await expect(page.locator('html')).toHaveAttribute('dir', route.dir);
			await expectNoHorizontalOverflow(page, `${viewport.name} ${route.path}`);
			await guards.assertClean();
		});
	}
}

for (const locale of ['ar', 'en']) {
	test(`scrolls a short ${locale} drawer and follows its last link by keyboard`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 180 });
		await expectHttpOk(page, `/${locale}/articles/welcome/`);
		const menu = page.locator('astro-island:not([ssr]) [data-header-chrome] button[aria-controls="site-mobile-nav"]');
		await menu.focus();
		await page.keyboard.press('Enter');
		const drawer = page.getByRole('dialog');
		const nav = drawer.getByRole('navigation');
		const explore = nav.getByRole('button');
		await expect(explore).toHaveClass(/(?:^|\s)bg-muted(?:\s|$)/);
		await expect(explore).not.toHaveAttribute('aria-current', 'page');
		await explore.focus();
		await page.keyboard.press('Enter');
		const last = nav.getByRole('link').last();
		await expect(last).toBeVisible();
		expect(await nav.evaluate((element) => element.scrollHeight)).toBeGreaterThan(await nav.evaluate((element) => element.clientHeight));
		await nav.hover();
		await page.mouse.wheel(0, 180);
		await expect(last).toBeInViewport({ ratio: 1 });
		await nav.evaluate((element) => {
			element.scrollTop = 0;
		});
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(last).toBeFocused();
		await expect.poll(() => nav.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(`/${locale}/components/`);
		await expect(drawer).toHaveCount(0);
	});

	test(`wraps long ${locale} content and link text at 320px`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await expectHttpOk(page, `/${locale}/articles/welcome/`);
		await page.locator('main').evaluate((main, language) => {
			const word = (language === 'ar' ? 'اختبارعنوانطويل' : 'UnbrokenArticleTitle').repeat(12);
			const heading = main.querySelector('h1')!;
			heading.textContent = word;
			const link = document.createElement('a');
			link.href = '/' + word + '/';
			link.textContent = link.href;
			main.querySelector('.prose')!.append(link);
		}, locale);
		await expectNoHorizontalOverflow(page, locale + ' long content');
	});
}

for (const locale of ['ar', 'en']) {
	const other = locale === 'ar' ? 'en' : 'ar';
	for (const mode of ['disabled', 'blocked', 'delayed'] as const) {
		test(`keeps ${locale} mobile navigation usable with JavaScript ${mode}`, async ({ browser, baseURL }) => {
			const context = await browser.newContext({ baseURL: baseURL!, javaScriptEnabled: mode !== 'disabled', viewport: { width: 320, height: 220 } });
			let release = () => {};
			const pending = new Promise<void>((resolve) => {
				release = resolve;
			});
			try {
				const page = await context.newPage();
				if (mode !== 'disabled') {
					await page.route('**/HeaderChrome.*.js', async (route) => {
						if (mode === 'blocked') await route.abort();
						else {
							await pending;
							await route.continue();
						}
					});
					await page.route('**/ComponentCatalog.*.js', (route) => route.abort());
				}
				await page.goto(`/${locale}/components/`, { waitUntil: 'commit' });
				const fallback = page.locator('[data-header-fallback]');
				await expect(fallback.locator(`a[href="/${locale}/articles/"]`)).toBeVisible();
				await expect(page.locator('[data-catalog-fallback] a[href="#combobox"]')).toBeVisible();
				await fallback.locator(`a[hreflang="${other}"]`).click();
				await expect(page).toHaveURL(`/${other}/components/`);
				await fallback.locator(`a[href="/${other}/articles/"]`).click();
				await expect(page).toHaveURL(`/${other}/articles/`);
				release();
				if (mode === 'delayed') await expect(fallback).toBeHidden();
			} finally {
				release();
				await context.close();
			}
		});
	}

	test(`restores focus from the ${locale} drawer and reaches footer privacy controls`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 220 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await expectHttpOk(page, `/${locale}/`);
		const menu = page.locator('astro-island:not([ssr]) [data-header-chrome] button[aria-controls="site-mobile-nav"]');
		await menu.press('Enter');
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
		await expect(page.locator('[data-slot="sheet-overlay"]')).toHaveCSS('animation-name', 'none');
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toHaveCount(0);
		await expect(menu).toBeFocused();
		const footer = page.locator('footer');
		const link = footer.locator(`nav a[href="/${locale}/articles/"]`).first();
		await link.focus();
		await expect(link).toBeFocused();
		const settings = footer.locator('[data-privacy-settings]');
		await settings.press('Enter');
		await expect(page.locator('[data-cookie-consent]')).toBeVisible();
	});

	test(`wraps ${locale} article cards and verifies CTA contracts`, async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		await expectHttpOk(page, `/${locale}/articles/`);
		const card = page.locator('main article').first();
		await card.evaluate((element, language) => {
			const word = (language === 'ar' ? 'عنوانطويل' : 'UnbrokenTitle').repeat(20);
			for (const anchor of element.querySelectorAll('a')) {
				anchor.firstChild?.remove();
				anchor.prepend(word);
			}
		}, locale);
		await expectNoHorizontalOverflow(page);
		await expect(card.locator('a a')).toHaveCount(0);
		await expectHttpOk(page, `/${locale}/components/`);
		const internal = page.locator('[data-catalog-cta] a[data-astro-prefetch]');
		const external = page.locator('[data-catalog-cta] a[target="_blank"]');
		await expect(internal).toHaveAttribute('href', `/${locale}/articles/`);
		await expect(external).toHaveAttribute('href', 'https://docs.astro.build/');
		await expect(external).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(external).not.toHaveAttribute('data-astro-prefetch');
		await internal.focus();
		await expect(internal).toBeFocused();
		await expect.poll(() => internal.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');
		await internal.press('Enter');
		await expect(page).toHaveURL(`/${locale}/articles/`);
	});
}
