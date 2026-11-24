import { expect, type Page } from '@playwright/test';

const IGNORED_CONSOLE_TYPES = new Set(['warning', 'info', 'debug', 'log']);

export async function attachConsoleGuards(page: Page) {
	const pageErrors: string[] = [];
	const consoleErrors: string[] = [];

	page.on('pageerror', (error) => {
		const message = error.message;
		// Native cross-document view transitions may abort mid-navigation (language switch, rapid clicks).
		if (message.includes('Transition was skipped') || message === 'Transition was aborted because of invalid state. ViewTransition opt-in disabled') return;
		pageErrors.push(message);
	});

	page.on('console', (message) => {
		if (message.type() !== 'error') return;
		const text = message.text();
		// Favicon / optional third-party noise / intentional missing routes should not fail smoke tests.
		if (text.includes('favicon') || text.includes('net::ERR_') || text.includes('status of 404')) return;
		consoleErrors.push(text);
	});

	return {
		assertClean: async () => {
			expect(pageErrors, 'Unexpected page errors').toEqual([]);
			expect(consoleErrors, 'Unexpected console errors').toEqual([]);
		},
		ignoredTypes: IGNORED_CONSOLE_TYPES,
	};
}

export async function expectHttpOk(page: Page, path: string) {
	const response = await page.goto(path);
	expect(response?.status(), `${path} HTTP status`).toBe(200);
	return response;
}

export async function expectExactlyOneH1(page: Page, pathLabel?: string) {
	await expect(page.getByRole('heading', { level: 1 }), pathLabel ? `${pathLabel} h1 count` : 'h1 count').toHaveCount(1);
}

export async function expectNoHorizontalOverflow(page: Page, pathLabel?: string) {
	const overflow = await page.evaluate(() => {
		const doc = document.documentElement;
		const body = document.body;
		return {
			html: doc.scrollWidth - doc.clientWidth,
			body: body.scrollWidth - body.clientWidth,
		};
	});

	expect(overflow.html, `${pathLabel ?? 'page'} html horizontal overflow`).toBeLessThanOrEqual(1);
	expect(overflow.body, `${pathLabel ?? 'page'} body horizontal overflow`).toBeLessThanOrEqual(1);
}

export async function switchLanguage(page: Page, switchLabel: string, targetLanguage: string) {
	const combobox = page.getByRole('combobox', { name: switchLabel });
	await expect(combobox).toBeVisible();
	await combobox.click();
	const option = page.getByRole('option', { name: targetLanguage });
	await expect(option).toBeVisible();
	await option.click();
}

export async function setThemeMode(page: Page, themeLabel: string, optionLabel: string) {
	const combobox = page.getByRole('combobox', { name: themeLabel });
	await expect(combobox).toBeVisible();
	await combobox.click();
	const option = page.getByRole('option', { name: optionLabel });
	await expect(option).toBeVisible();
	await option.click();
}

export async function setSystemColorScheme(page: Page, scheme: 'light' | 'dark') {
	await page.emulateMedia({ colorScheme: scheme });
}
