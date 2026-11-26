import { defineConfig, devices } from '@playwright/test';

const externalPreview = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: 4,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: externalPreview || 'http://127.0.0.1:4321',
		trace: 'on-first-retry',
	},
	...(externalPreview
		? {}
		: {
				webServer: {
					command: 'pnpm run preview --host 127.0.0.1 --port 4321',
					url: 'http://127.0.0.1:4321/',
					reuseExistingServer: !process.env.CI,
					timeout: 120_000,
				},
			}),
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
});
