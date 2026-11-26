import { z } from 'astro/zod';
import { LEAD_LIMITS, LEAD_PARTNERSHIP_TYPES, LEAD_USER_RANGES } from '../src/lib/leads/contract';

const organization = z.string().trim().min(LEAD_LIMITS.organization.min).max(LEAD_LIMITS.organization.max);
const details = z.string().trim().min(LEAD_LIMITS.details.min).max(LEAD_LIMITS.details.max);
const common = {
	locale: z.enum(['ar', 'en']),
	requestId: z.uuidv4(),
	turnstileToken: z.string().min(1).max(LEAD_LIMITS.turnstileToken.max),
	privacyAccepted: z.literal(true),
	name: z.string().trim().min(LEAD_LIMITS.name.min).max(LEAD_LIMITS.name.max),
	email: z.string().trim().max(LEAD_LIMITS.email.max).pipe(z.email()),
};

export const leadSchema = z.discriminatedUnion('type', [
	z.strictObject({
		...common,
		type: z.literal('general'),
		organization: organization.optional(),
		message: details,
	}),
	z.strictObject({
		...common,
		type: z.literal('consultation'),
		organization: organization.optional(),
		service: z
			.string()
			.max(LEAD_LIMITS.service.max)
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		need: details,
	}),
	z.strictObject({
		...common,
		type: z.literal('demo'),
		organization,
		userRange: z.enum(LEAD_USER_RANGES),
		deploymentNeeds: details,
	}),
	z.strictObject({
		...common,
		type: z.literal('partnership'),
		organization,
		partnershipType: z.enum(LEAD_PARTNERSHIP_TYPES),
		proposal: details,
	}),
]);

export const turnstileResponse = z.object({
	success: z.boolean(),
	hostname: z.string().optional(),
	action: z.string().optional(),
	'error-codes': z.array(z.string()).optional(),
});
