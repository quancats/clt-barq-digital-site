import { describe, expect, it } from 'vitest';
import { isNonProductionAppEnv, isProductionAppEnv, type AppEnv } from '@/lib/env/appEnv';

describe('appEnv helpers', () => {
	it('detects production', () => {
		expect(isProductionAppEnv('production')).toBe(true);
		expect(isNonProductionAppEnv('production')).toBe(false);
	});

	it('treats local and staging as non-production', () => {
		const nonProd: AppEnv[] = ['local', 'staging'];
		for (const env of nonProd) {
			expect(isProductionAppEnv(env)).toBe(false);
			expect(isNonProductionAppEnv(env)).toBe(true);
		}
	});
});
