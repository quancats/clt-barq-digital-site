import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const [, , origin, dist] = process.argv;
if (!origin || !dist || new URL(origin).hostname !== '127.0.0.1') throw new Error('Supply the loopback fixture origin and its isolated dist directory.');
const routes = ['/', '/products/bim/', '/services/fixture-service/', '/insights/articles/fixture-article/', '/contact/'];
const browser = await chromium.launch();
const results = [];
const lab = { viewport: { width: 360, height: 800 }, latencyMs: 150, downloadKbps: 1600, uploadKbps: 750, cpuSlowdown: 4 };

try {
	for (const prefix of ['', '/en']) {
		for (const route of routes) {
			const path = prefix + route;
			const context = await browser.newContext({ viewport: lab.viewport, isMobile: true, deviceScaleFactor: 2, colorScheme: 'light', reducedMotion: 'reduce' });
			try {
				const page = await context.newPage();
				await page.route(
					(url) => url.origin !== origin,
					(request) => request.abort(),
				);
				await page.addInitScript(() => {
					window.localLab = { lcp: 0, cls: 0 };
					new PerformanceObserver((list) => {
						for (const entry of list.getEntries()) window.localLab.lcp = entry.startTime;
					}).observe({ type: 'largest-contentful-paint', buffered: true });
					new PerformanceObserver((list) => {
						for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.localLab.cls += entry.value;
					}).observe({ type: 'layout-shift', buffered: true });
				});
				const cdp = await context.newCDPSession(page);
				await cdp.send('Network.enable');
				await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
				await cdp.send('Network.emulateNetworkConditions', {
					offline: false,
					latency: lab.latencyMs,
					downloadThroughput: (lab.downloadKbps * 1000) / 8,
					uploadThroughput: (lab.uploadKbps * 1000) / 8,
				});
				await cdp.send('Emulation.setCPUThrottlingRate', { rate: lab.cpuSlowdown });
				const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
				if (response?.status() !== 200) throw new Error(`${path} did not return 200`);
				const metrics = await page.evaluate(() => {
					const pages = performance.getEntriesByType('navigation');
					const resources = performance.getEntriesByType('resource');
					return {
						...window.localLab,
						reflow: document.documentElement.scrollWidth <= window.innerWidth,
						transferBytes: [...pages, ...resources].reduce((size, item) => size + item.transferSize, 0),
						scripts: resources.filter((item) => item.initiatorType === 'script' && item.name.startsWith(location.origin + '/_astro/')).map((item) => new URL(item.name).pathname),
					};
				});
				const javascript = await Promise.all([...new Set(metrics.scripts)].map(async (url) => gzipSync(await readFile(resolve(dist, url.slice(1)))).length));
				await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
				const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
				results.push({ path, lcpMs: Math.round(metrics.lcp), cls: Number(metrics.cls.toFixed(3)), transferBytes: metrics.transferBytes, localExternalJsGzipBytes: javascript.reduce((a, b) => a + b, 0), reflow: metrics.reflow, axe: axe.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target }) => target) })) });
			} finally {
				await context.close();
			}
		}
	}
	console.log(JSON.stringify({ chromium: browser.version(), lab, results }, null, 2));
	if (results.some(({ reflow, axe }) => !reflow || axe.length > 0)) process.exitCode = 1;
} finally {
	await browser.close();
}
