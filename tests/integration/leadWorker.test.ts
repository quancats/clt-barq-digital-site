import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LEAD_MAX_BODY_BYTES } from '../../src/lib/leads/contract';
import worker from '../../worker';

const origin = 'https://barq.example';
const requestId = '58f086cd-134f-4b93-a03e-078a4739dcf5';
const common = {
	locale: 'ar',
	requestId,
	turnstileToken: 'synthetic-test-proof',
	privacyAccepted: true,
	name: 'Synthetic Contact',
	email: 'contact@example.test',
};
const general = { ...common, type: 'general', message: 'Synthetic message only' };

function config() {
	return {
		ASSETS: { fetch: vi.fn(async () => new Response('Static content')) },
		LEAD_RATE_LIMIT: { limit: vi.fn(async (_input: { key: string }) => ({ success: true })) },
		LEAD_REPLAY_LIMIT: { limit: vi.fn(async (_input: { key: string }) => ({ success: true })) },
		LEAD_DELIVERY: { fetch: vi.fn(async (_request: Request) => new Response(null, { status: 202 })) },
		LEAD_ALLOWED_ORIGIN: origin,
		LEAD_ALLOWED_SERVICES: 'consulting, implementation',
		TURNSTILE_SECRET_KEY: 'synthetic-test-secret',
	};
}

function request(body: unknown = general, overrides: RequestInit = {}) {
	return new Request(`${origin}/api/leads`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'CF-Connecting-IP': '192.0.2.5',
			Origin: origin,
		},
		body: JSON.stringify(body),
		...overrides,
	});
}

function proofResponse(hostname = 'barq.example', action = 'lead') {
	return Response.json({ success: true, hostname, action });
}

let verify: ReturnType<typeof vi.fn>;

beforeEach(() => {
	verify = vi.fn(async () => proofResponse());
	vi.stubGlobal('fetch', verify);
	vi.spyOn(console, 'info').mockImplementation(() => undefined);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('lead intake Worker', () => {
	it('delivers verified submissions to the fixed company inbox without sending the Turnstile token', async () => {
		const send = vi.fn(async (_message: { from: string; to: string; subject: string; text: string }) => ({ messageId: 'test-message' }));
		const { LEAD_DELIVERY: _delivery, ...base } = config();
		const env = { ...base, LEAD_EMAIL: { send } };
		const response = await worker.fetch(request(), env);
		expect(response.status).toBe(202);
		expect(send).toHaveBeenCalledOnce();
		const [message] = send.mock.calls[0]!;
		expect(message).toMatchObject({ from: 'notifications@barqdigital.sa', to: 'info@barqdigital.sa', subject: 'Barq Digital website: general' });
		expect(message.text).toContain(general.message);
		expect(message.text).not.toContain(common.turnstileToken);
	});

	it('returns a delivery failure when Cloudflare Email Service rejects the message', async () => {
		const send = vi.fn().mockRejectedValue(new Error('Synthetic provider failure'));
		const { LEAD_DELIVERY: _delivery, ...base } = config();
		const env = { ...base, LEAD_EMAIL: { send } };
		const response = await worker.fetch(request(), env);
		expect(response.status).toBe(503);
		expect(await response.json()).toMatchObject({ ok: false, code: 'provider_unavailable' });
		expect(send).toHaveBeenCalledOnce();
	});
	it.each([
		general,
		{ ...common, type: 'consultation', service: 'consulting', need: 'Synthetic consultation' },
		{
			...common,
			type: 'demo',
			organization: 'Test Institution',
			userRange: '1-50',
			deploymentNeeds: 'Synthetic deployment needs',
		},
		{
			...common,
			locale: 'en',
			type: 'partnership',
			organization: 'Test Company',
			partnershipType: 'delivery',
			proposal: 'Synthetic partnership proposal',
		},
	])('accepts $type only after verification and delivery acceptance', async (lead) => {
		const env = config();
		const response = await worker.fetch(request(lead), env);
		const result = await response.json();
		expect(response.status).toBe(202);
		expect(response.headers.get('Cache-Control')).toBe('no-store');
		expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
		expect(result).toEqual({ ok: true, correlationId: expect.any(String) });
		expect(verify).toHaveBeenCalledOnce();
		expect(env.LEAD_DELIVERY.fetch).toHaveBeenCalledOnce();
		const [delivery] = env.LEAD_DELIVERY.fetch.mock.calls[0]!;
		expect(delivery.headers.get('Idempotency-Key')).toBe(requestId);
		expect(delivery.headers.get('X-Correlation-ID')).toBe(result.correlationId);
		expect(delivery.headers.get('X-Lead-Proof-Key')).toMatch(/^[a-f0-9]{64}$/);
		const { requestId: _requestId, turnstileToken: _token, ...expected } = lead;
		expect(await delivery.json()).toEqual(expected);
		const log = vi.mocked(console.info).mock.calls[0];
		expect(log).toEqual([{ event: 'lead_request', correlationId: result.correlationId, outcome: 'accepted' }]);
	});

	it.each([{ ...general, email: 'invalid' }, { ...general, message: 'short' }, { ...general, type: 'consultation', service: 'unlisted', need: 'Synthetic consultation' }, { ...general, privacyAccepted: false }, { ...general, unknownField: 'extra' }, { ...general, type: 'unknown' }, null])('rejects invalid lead input without upstream calls', async (lead) => {
		const env = config();
		const response = await worker.fetch(request(lead), env);
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ ok: false, code: 'invalid_input' });
		expect(env.LEAD_DELIVERY.fetch).not.toHaveBeenCalled();
		expect(verify).not.toHaveBeenCalled();
	});

	it('reports only expected field names', async () => {
		const response = await worker.fetch(request({ ...general, email: 'invalid' }), config());
		expect(await response.json()).toMatchObject({ fieldErrors: ['email'] });
	});

	it.each([
		[405, request(undefined, { method: 'GET', body: null })],
		[403, request(undefined, { headers: { Origin: 'https://other.example' } })],
		[415, request(undefined, { headers: { Origin: origin, 'Content-Type': 'text/plain' } })],
		[400, request(undefined, { body: '{' })],
		[413, request(undefined, { body: 'أ'.repeat(LEAD_MAX_BODY_BYTES / 2 + 1) })],
	])('returns %s for an invalid HTTP input', async (status, leadRequest) => {
		const env = config();
		expect((await worker.fetch(leadRequest, env)).status).toBe(status);
		expect(verify).not.toHaveBeenCalled();
		expect(env.LEAD_DELIVERY.fetch).not.toHaveBeenCalled();
	});

	it.each([
		[403, () => Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] })],
		[403, () => proofResponse('other.example')],
		[403, () => proofResponse('barq.example', 'another-action')],
		[503, () => Response.json({ success: false, 'error-codes': ['internal-error'] })],
		[503, () => Response.json({ malformed: true })],
		[503, () => new Response(null, { status: 500 })],
	])('fails closed with %s when verification does not succeed', async (status, response) => {
		verify.mockResolvedValueOnce(response());
		const env = config();
		expect((await worker.fetch(request(), env)).status).toBe(status);
		expect(env.LEAD_DELIVERY.fetch).not.toHaveBeenCalled();
	});

	it('limits requests before verification and reports a retry window', async () => {
		const env = config();
		env.LEAD_RATE_LIMIT.limit.mockResolvedValueOnce({ success: false });
		const response = await worker.fetch(request(), env);
		expect(response.status).toBe(429);
		expect(response.headers.get('Retry-After')).toBe('60');
		expect(verify).not.toHaveBeenCalled();
		expect(env.LEAD_DELIVERY.fetch).not.toHaveBeenCalled();
	});

	it.each(['id', 'proof'])('detects a repeated %s within the replay window', async (replay) => {
		const env = config();
		const seen = new Set<string>();
		env.LEAD_REPLAY_LIMIT.limit.mockImplementation(async ({ key }) => {
			if (seen.has(key)) return { success: false };
			seen.add(key);
			return { success: true };
		});
		expect((await worker.fetch(request(), env)).status).toBe(202);
		const second = replay === 'id' ? { ...general, turnstileToken: 'new-synthetic-proof' } : { ...general, requestId: crypto.randomUUID() };
		expect((await worker.fetch(request(second), env)).status).toBe(409);
		expect(env.LEAD_DELIVERY.fetch).toHaveBeenCalledOnce();
	});

	it.each([200, 302, 409, 500])('requires explicit provider acceptance when it returns %s', async (status) => {
		const env = config();
		env.LEAD_DELIVERY.fetch.mockResolvedValueOnce(new Response(null, { status }));
		const response = await worker.fetch(request(), env);
		expect(response.status).toBe(status === 409 ? 409 : 503);
		expect(await response.json()).toMatchObject({ ok: false });
	});

	it('handles a rejected delivery without echoing details', async () => {
		const env = config();
		env.LEAD_DELIVERY.fetch.mockRejectedValueOnce(new Error('synthetic upstream detail'));
		const response = await worker.fetch(request(), env);
		expect(response.status).toBe(503);
		expect(await response.json()).toEqual({
			ok: false,
			code: 'provider_unavailable',
			correlationId: expect.any(String),
		});
	});

	it('reports a timed-out delivery without retrying the adapter', async () => {
		vi.useFakeTimers();
		try {
			const env = config();
			let signal: AbortSignal | undefined;
			let notify: () => void;
			const deliveryStarted = new Promise<void>((resolve) => {
				notify = resolve;
			});
			env.LEAD_DELIVERY.fetch.mockImplementation(async (outgoing) => {
				signal = outgoing.signal;
				notify();
				return new Promise(() => {});
			});
			const result = worker.fetch(request(), env);
			await deliveryStarted;
			await vi.advanceTimersByTimeAsync(8000);
			expect((await result).status).toBe(503);
			expect(env.LEAD_DELIVERY.fetch).toHaveBeenCalledOnce();
			expect(signal?.aborted).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});

	it('handles omitted or failed bindings without success', async () => {
		const { LEAD_DELIVERY: _delivery, ...withoutDelivery } = config();
		expect((await worker.fetch(request(), withoutDelivery)).status).toBe(503);
		const env = config();
		env.LEAD_RATE_LIMIT.limit.mockRejectedValueOnce(new Error('synthetic limiter failure'));
		expect((await worker.fetch(request(), env)).status).toBe(503);
		expect(verify).not.toHaveBeenCalled();
		expect(env.LEAD_DELIVERY.fetch).not.toHaveBeenCalled();
	});

	it('delegates static content and returns JSON 404 for unknown API paths', async () => {
		const env = config();
		const response = await worker.fetch(new Request(origin), env);
		expect(await response.text()).toBe('Static content');
		const missing = await worker.fetch(new Request(`${origin}/api/unknown`), env);
		expect(missing.status).toBe(404);
		expect(await missing.json()).toMatchObject({ code: 'not_found' });
		expect(env.ASSETS.fetch).toHaveBeenCalledOnce();
	});
});
