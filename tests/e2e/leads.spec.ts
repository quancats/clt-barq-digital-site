import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import worker from '../../worker/index';

const journeys = [
	{ type: 'general', path: '/ar/contact/', details: 'message' },
	{ type: 'consultation', path: '/ar/contact/consultation/?service=fixture-service', details: 'need', choice: ['service', 'fixture-service'] },
	{ type: 'demo', path: '/ar/contact/demo/', details: 'deploymentNeeds', choice: ['userRange', '1-50'] },
	{ type: 'partnership', path: '/ar/partners/', details: 'proposal', choice: ['partnershipType', 'technology'] },
] as const;

test.skip(process.env.PLAYWRIGHT_LEAD_FIXTURE !== '1', 'Requires an isolated build with synthetic contact, privacy, and service entries.');

async function mockVerification(page: Page) {
	await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) =>
		route.fulfill({
			contentType: 'text/javascript',
			body: `window.turnstile = {
				render(container, options) {
					window.expireVerification = options['expired-callback'];
					this.options = options;
					options.callback('local-fixture-proof');
					return 'fixture-widget';
				},
				reset() { this.options.callback('local-fixture-proof'); },
			};`,
		}),
	);
}

async function fillLead(page: Page, journey: (typeof journeys)[number]) {
	const form = page.locator('[data-lead-form]');
	await form.locator('[name="name"]').fill('Fixture Person');
	await form.locator('[name="email"]').fill('fixture@example.invalid');
	if (journey.type === 'demo' || journey.type === 'partnership') await form.locator('[name="organization"]').fill('Synthetic Institution');
	if ('choice' in journey) {
		const dropdown = form.locator('[data-lead-dropdown]');
		const trigger = dropdown.locator('[data-lead-dropdown-trigger]');
		await trigger.press('Enter');
		await dropdown.locator(`[data-lead-option="${journey.choice[1]}"]`).press('Enter');
		await expect(trigger).toBeFocused();
		await expect(dropdown.locator(`[name="${journey.choice[0]}"]`)).toHaveValue(journey.choice[1]);
	}
	await form.locator(`[name="${journey.details}"]`).fill('Synthetic request body for local verification.');
	await form.locator('[name="privacyAccepted"]').check();
	return form.locator('button[type="submit"]');
}

for (const locale of ['ar', 'en'] as const) {
	test.describe(locale, () => {
		test.use({ viewport: { width: 320, height: 720 }, reducedMotion: 'reduce', colorScheme: 'light' });
		for (const journey of journeys) {
			test(`${journey.type} validates, sends once, and announces acceptance`, async ({ page }) => {
				await mockVerification(page);
				const payloads: Record<string, unknown>[] = [];
				const deliveries: Record<string, unknown>[] = [];
				await page.route('**/api/leads', async (route) => {
					const request = route.request();
					const url = new URL(request.url());
					const payload = request.postDataJSON() as Record<string, unknown>;
					payloads.push(payload);
					const originalFetch = globalThis.fetch;
					globalThis.fetch = async (input) => {
						if (String(input) !== 'https://challenges.cloudflare.com/turnstile/v0/siteverify') throw new Error('Unexpected outbound request');
						return Response.json({ success: true, hostname: url.hostname, action: 'lead' });
					};
					try {
						const response = await worker.fetch(
							new Request(url, {
								method: 'POST',
								headers: { ...request.headers(), 'CF-Connecting-IP': '192.0.2.42' },
								body: JSON.stringify(payload),
							}),
							{
								ASSETS: { fetch: async () => new Response(null, { status: 404 }) },
								LEAD_RATE_LIMIT: { limit: async () => ({ success: true }) },
								LEAD_REPLAY_LIMIT: { limit: async () => ({ success: true }) },
								LEAD_ALLOWED_ORIGIN: url.origin,
								LEAD_ALLOWED_SERVICES: 'fixture-service',
								TURNSTILE_SECRET_KEY: 'synthetic-test-secret',
								LEAD_DELIVERY: {
									fetch: async (delivery) => {
										deliveries.push(await delivery.json());
										await new Promise((resolve) => setTimeout(resolve, 200));
										return new Response(null, { status: 202 });
									},
								},
							},
						);
						await route.fulfill({ status: response.status, json: await response.json() });
					} finally {
						globalThis.fetch = originalFetch;
					}
				});
				await page.goto(`${locale === 'en' ? '/en' : ''}${journey.path}`);
				await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
				const form = page.locator('[data-lead-form]');
				await expect(form.locator('[name="name"]')).toBeEnabled();
				await form.locator('[name="name"]').focus();
				await page.keyboard.press('Tab');
				await expect(form.locator('[name="email"]')).toBeFocused();
				await form.locator('button[type="submit"]').click();
				await expect(form.locator('[name="name"]')).toBeFocused();
				expect(payloads).toHaveLength(0);
				if (journey.type === 'consultation') await expect(form.locator('[name="service"]')).toHaveValue('fixture-service');
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
				const accessibility = await new AxeBuilder({ page }).include('[data-lead-form]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
				expect(accessibility.violations).toEqual([]);
				const submit = await fillLead(page, journey);
				await submit.evaluate((button) => {
					if (!(button instanceof HTMLElement)) throw new Error('Missing submit button');
					button.click();
					button.click();
				});
				await expect(form.getByRole('status')).toHaveText(locale === 'ar' ? 'تم قبول طلبك.' : 'Your request was accepted.');
				await expect(submit).toBeDisabled();
				expect(payloads).toHaveLength(1);
				expect(payloads[0]).toMatchObject({ type: journey.type, locale, privacyAccepted: true, turnstileToken: 'local-fixture-proof' });
				expect(deliveries).toHaveLength(1);
				expect(deliveries[0]).toMatchObject({ type: journey.type, locale, privacyAccepted: true });
				expect(deliveries[0]).not.toHaveProperty('turnstileToken');
				expect(page.url()).not.toContain('example.invalid');
			});
		}
	});
}

test('reports validation errors, expires proof, and avoids success on provider failure', async ({ page }) => {
	await mockVerification(page);
	await page.goto('/en/contact/');
	const form = page.locator('[data-lead-form]');
	const submit = await fillLead(page, journeys[0]);
	await page.evaluate(() => (window as Window & { expireVerification?: () => void }).expireVerification?.());
	await expect(submit).toBeDisabled();
	await expect(form.getByRole('status')).toContainText('Complete the verification again');
	await page.reload();
	await fillLead(page, journeys[0]);
	let attempts = 0;
	await page.route('**/api/leads', (route) => {
		attempts += 1;
		return route.fulfill({
			status: attempts === 1 ? 400 : 503,
			json: { ok: false, correlationId: 'fixture-correlation', ...(attempts === 1 ? { code: 'invalid_input', fieldErrors: ['email'] } : { code: 'provider_unavailable' }) },
		});
	});
	await submit.click();
	await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
	await expect(form.locator('[name="email"]')).toBeFocused();
	await submit.click();
	await expect(form.getByRole('status')).toContainText('We could not confirm receipt.');
	await expect(form.locator('[name="email"]')).toHaveValue('fixture@example.invalid');
});
