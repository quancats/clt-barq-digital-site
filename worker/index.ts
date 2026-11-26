import { LEAD_ENDPOINT, LEAD_MAX_BODY_BYTES, LEAD_TURNSTILE_ACTION, type LeadErrorCode, type LeadResponse } from '../src/lib/leads/contract';
import { leadSchema, turnstileResponse } from './lead-schema';

interface FetchBinding {
	fetch(request: Request): Promise<Response>;
}

interface RateLimitBinding {
	limit(input: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
	ASSETS: FetchBinding;
	LEAD_RATE_LIMIT?: RateLimitBinding;
	LEAD_REPLAY_LIMIT?: RateLimitBinding;
	LEAD_DELIVERY?: FetchBinding;
	LEAD_ALLOWED_ORIGIN?: string;
	LEAD_ALLOWED_SERVICES?: string;
	TURNSTILE_SECRET_KEY?: string;
}

const errorStatus: Record<LeadErrorCode, number> = {
	invalid_input: 400,
	bot_rejected: 403,
	verification_unavailable: 503,
	rate_limited: 429,
	duplicate: 409,
	provider_unavailable: 503,
	unavailable: 503,
	method_not_allowed: 405,
	unsupported_media_type: 415,
	payload_too_large: 413,
	origin_forbidden: 403,
	not_found: 404,
};

const oversized = Symbol('oversized request');

async function readBody(request: Request): Promise<unknown> {
	if (Number(request.headers.get('Content-Length')) > LEAD_MAX_BODY_BYTES) return oversized;
	if (!request.body) return null;

	const reader = request.body.getReader();
	const decoder = new TextDecoder('utf-8', { fatal: true });
	let body = '';
	let bytes = 0;

	try {
		for (;;) {
			const chunk = await reader.read();
			if (chunk.done) break;
			bytes += chunk.value.byteLength;
			if (bytes > LEAD_MAX_BODY_BYTES) {
				void reader.cancel().catch(() => {});
				return oversized;
			}
			body += decoder.decode(chunk.value, { stream: true });
		}

		return JSON.parse(body + decoder.decode()) as unknown;
	} catch {
		void reader.cancel().catch(() => {});
		return null;
	} finally {
		reader.releaseLock();
	}
}

async function digest(value: string): Promise<string> {
	const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
	return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function verify(token: string, secret: string, hostname: string) {
	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			redirect: 'error',
			body: new URLSearchParams({ secret, response: token }),
			signal: AbortSignal.timeout(5000),
		});
		if (!response.ok) return 'verification_unavailable';

		const result = turnstileResponse.safeParse(await response.json());
		if (!result.success) return 'verification_unavailable';
		if (result.data['error-codes']?.includes('timeout-or-duplicate')) return 'bot_rejected';
		if (result.data['error-codes']?.some((code) => ['internal-error', 'missing-input-secret', 'invalid-input-secret', 'bad-request'].includes(code))) {
			return 'verification_unavailable';
		}
		if (!result.data.success || result.data.hostname !== hostname || result.data.action !== LEAD_TURNSTILE_ACTION) {
			return 'bot_rejected';
		}
		return null;
	} catch {
		return 'verification_unavailable';
	}
}

async function deliver(binding: FetchBinding, body: string, requestId: string, tokenKey: string, correlationId: string) {
	const controller = new AbortController();
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			binding.fetch(
				new Request('https://lead-delivery.internal/leads', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Idempotency-Key': requestId,
						'X-Lead-Proof-Key': tokenKey,
						'X-Correlation-ID': correlationId,
					},
					body,
					redirect: 'error',
					signal: controller.signal,
				}),
			),
			new Promise<never>((_, reject) => {
				timer = setTimeout(() => {
					controller.abort();
					reject(new Error('Lead delivery timed out'));
				}, 8000);
			}),
		]);
	} finally {
		clearTimeout(timer);
	}
}

function result(body: LeadResponse) {
	const headers = new Headers({
		'Cache-Control': 'no-store',
		'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
		'Referrer-Policy': 'no-referrer',
		'X-Content-Type-Options': 'nosniff',
		'X-Robots-Tag': 'noindex, nofollow',
	});
	if (!body.ok) {
		if (body.code === 'method_not_allowed') headers.set('Allow', 'POST');
		if (body.code === 'rate_limited') headers.set('Retry-After', '60');
	}
	console.info({
		event: 'lead_request',
		correlationId: body.correlationId,
		outcome: body.ok ? 'accepted' : body.code,
	});
	return Response.json(body, { status: body.ok ? 202 : errorStatus[body.code], headers });
}

async function handleLead(request: Request, env: Env) {
	const correlationId = crypto.randomUUID();
	const fail = (code: LeadErrorCode, fieldErrors?: string[]) => result({ ok: false, correlationId, code, ...(fieldErrors?.length ? { fieldErrors } : {}) });

	const url = new URL(request.url);
	if (url.pathname !== LEAD_ENDPOINT) return fail('not_found');
	if (request.method !== 'POST') return fail('method_not_allowed');
	if (!env.LEAD_ALLOWED_ORIGIN || url.origin !== env.LEAD_ALLOWED_ORIGIN || request.headers.get('Origin') !== env.LEAD_ALLOWED_ORIGIN) {
		return fail('origin_forbidden');
	}
	const contentType = request.headers.get('Content-Type')?.split(';')[0]?.trim().toLowerCase();
	if (contentType !== 'application/json') return fail('unsupported_media_type');

	const clientIp = request.headers.get('CF-Connecting-IP');
	if (!clientIp || !env.LEAD_RATE_LIMIT || !env.LEAD_REPLAY_LIMIT || !env.TURNSTILE_SECRET_KEY) {
		return fail('unavailable');
	}
	if (!env.LEAD_DELIVERY) return fail('provider_unavailable');

	try {
		if (!(await env.LEAD_RATE_LIMIT.limit({ key: await digest(clientIp) })).success) {
			return fail('rate_limited');
		}

		const body = await readBody(request);
		if (body === oversized) return fail('payload_too_large');

		const validation = leadSchema.safeParse(body);
		if (!validation.success) {
			const fields = validation.error.issues.flatMap(({ path }) => (typeof path[0] === 'string' ? [path[0]] : []));
			return fail('invalid_input', [...new Set(fields)]);
		}

		const { requestId, turnstileToken, ...lead } = validation.data;
		if (
			lead.type === 'consultation' &&
			!env.LEAD_ALLOWED_SERVICES?.split(',')
				.map((key) => key.trim())
				.includes(lead.service)
		) {
			return fail('invalid_input', ['service']);
		}

		const verificationFailure = await verify(turnstileToken, env.TURNSTILE_SECRET_KEY, url.hostname);
		if (verificationFailure) return fail(verificationFailure);

		const tokenKey = await digest(turnstileToken);
		if (!(await env.LEAD_REPLAY_LIMIT.limit({ key: `token:${tokenKey}` })).success) {
			return fail('duplicate');
		}
		if (!(await env.LEAD_REPLAY_LIMIT.limit({ key: `request:${requestId}` })).success) {
			return fail('duplicate');
		}

		try {
			const response = await deliver(env.LEAD_DELIVERY, JSON.stringify(lead), requestId, tokenKey, correlationId);
			if (response.status === 409) return fail('duplicate');
			if (response.status !== 202) return fail('provider_unavailable');
			return result({ ok: true, correlationId });
		} catch {
			return fail('provider_unavailable');
		}
	} catch {
		return fail('unavailable');
	}
}

export default {
	fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);
		if (pathname === '/api' || pathname.startsWith('/api/')) return handleLead(request, env);
		return env.ASSETS.fetch(request);
	},
};
