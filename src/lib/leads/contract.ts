export const LEAD_ENDPOINT = '/api/leads';
export const LEAD_TURNSTILE_ACTION = 'lead';
export const LEAD_MAX_BODY_BYTES = 16 * 1024;
export const LEAD_TYPES = ['general', 'consultation', 'demo', 'partnership'] as const;
export const LEAD_USER_RANGES = ['1-50', '51-200', '201-1000', '1001+'] as const;
export const LEAD_PARTNERSHIP_TYPES = ['technology', 'commercial', 'delivery', 'other'] as const;
export const LEAD_LIMITS = {
	name: { min: 2, max: 120 },
	email: { max: 254 },
	organization: { min: 2, max: 160 },
	details: { min: 10, max: 2000 },
	service: { max: 80 },
	turnstileToken: { max: 2048 },
} as const;

export type LeadType = (typeof LEAD_TYPES)[number];
export type LeadErrorCode = 'invalid_input' | 'bot_rejected' | 'verification_unavailable' | 'rate_limited' | 'duplicate' | 'provider_unavailable' | 'unavailable' | 'method_not_allowed' | 'unsupported_media_type' | 'payload_too_large' | 'origin_forbidden' | 'not_found';

export type LeadResponse = { ok: true; correlationId: string } | { ok: false; correlationId: string; code: LeadErrorCode; fieldErrors?: string[] };
