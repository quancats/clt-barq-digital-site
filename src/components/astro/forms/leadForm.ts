import { LEAD_ENDPOINT, LEAD_TURNSTILE_ACTION, type LeadResponse, type LeadType } from '@/lib/leads/contract';
import { leadCopy } from './leadCopy';

type LeadCopy = (typeof leadCopy)[keyof typeof leadCopy];
type Field = HTMLInputElement | HTMLTextAreaElement;
type Turnstile = {
	render: (container: HTMLElement, options: Record<string, unknown>) => string;
	reset: (widget: string) => void;
};

declare global {
	interface Window {
		turnstile?: Turnstile;
	}
}

let scriptLoad: Promise<Turnstile> | undefined;

function loadTurnstile() {
	if (window.turnstile) return Promise.resolve(window.turnstile);
	return (scriptLoad ??= new Promise<Turnstile>((resolve, reject) => {
		const script = document.createElement('script');
		const fail = () => {
			window.clearTimeout(timeout);
			script.remove();
			scriptLoad = undefined;
			reject(new Error('Verification unavailable'));
		};
		const timeout = window.setTimeout(fail, 15_000);
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.async = true;
		script.addEventListener('error', fail, { once: true });
		script.addEventListener(
			'load',
			() => {
				window.clearTimeout(timeout);
				if (window.turnstile) resolve(window.turnstile);
				else fail();
			},
			{ once: true },
		);
		document.head.append(script);
	}));
}

function errorMessage(code: string | undefined, copy: LeadCopy) {
	switch (code) {
		case 'invalid_input':
			return copy.invalid;
		case 'bot_rejected':
			return copy.bot;
		case 'rate_limited':
			return copy.rate;
		case 'duplicate':
			return copy.duplicate;
		case 'verification_unavailable':
		case 'unavailable':
			return copy.unavailable;
		default:
			return copy.failure;
	}
}

function initDropdown(form: HTMLFormElement, placeholder: string) {
	const root = form.querySelector<HTMLElement>('[data-lead-dropdown]');
	if (!root) return;

	const input = root.querySelector<HTMLInputElement>('input[type="hidden"]')!;
	const trigger = root.querySelector<HTMLButtonElement>('[data-lead-dropdown-trigger]')!;
	const label = trigger.querySelector<HTMLElement>('[data-lead-dropdown-value]')!;
	const list = root.querySelector<HTMLElement>('[data-lead-dropdown-options]')!;
	const options = [...list.querySelectorAll<HTMLButtonElement>('[data-lead-option]')];
	const setOpen = (open: boolean) => {
		list.hidden = !open;
		trigger.setAttribute('aria-expanded', String(open));
	};
	const select = (value: string) => {
		const selection = options.find(({ dataset }) => dataset.leadOption === value);
		input.value = selection?.dataset.leadOption ?? '';
		label.textContent = selection?.textContent?.trim() || placeholder;
		for (const option of options) option.setAttribute('aria-pressed', String(option === selection));
	};

	trigger.addEventListener('click', () => setOpen(list.hidden));
	root.addEventListener('focusout', ({ relatedTarget }) => {
		if (relatedTarget instanceof Node && root.contains(relatedTarget)) return;
		setOpen(false);
	});
	root.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !list.hidden) {
			event.preventDefault();
			setOpen(false);
			trigger.focus();
		}
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
		event.preventDefault();
		const index = options.findIndex((option) => option === event.target);
		const step = event.key === 'ArrowDown' ? 1 : -1;
		const next = index < 0 ? (step === 1 ? 0 : options.length - 1) : (index + step + options.length) % options.length;
		setOpen(true);
		options[next]?.focus();
	});
	for (const option of options) {
		option.addEventListener('click', () => {
			select(option.dataset.leadOption!);
			input.dispatchEvent(new Event('input', { bubbles: true }));
			setOpen(false);
			trigger.focus();
		});
	}
	form.addEventListener('reset', () => select(''));
	return { input, trigger, select };
}

export async function initLeadForm(form: HTMLFormElement) {
	const locale = form.dataset.locale === 'ar' ? 'ar' : 'en';
	const type = form.dataset.leadType as LeadType;
	const copy = leadCopy[locale];
	const fields = form.querySelector('fieldset')!;
	const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
	const status = form.querySelector<HTMLElement>('[data-lead-status]')!;
	const challenge = form.querySelector<HTMLElement>('[data-lead-challenge]')!;
	const controls = Array.from(form.querySelectorAll<Field>('input[name], textarea[name]'));
	const dropdown = initDropdown(form, copy.select);
	const focusTarget = (field: Field) => (dropdown && field === dropdown.input ? dropdown.trigger : field);
	let proof = '';
	let sending = false;
	let accepted = false;
	let requestId = '';
	const setStatus = (message: string, state: 'neutral' | 'success' | 'error' = 'neutral') => {
		status.dataset.state = state;
		status.textContent = message;
	};
	const updateSubmit = () => {
		submit.disabled = !proof || sending || accepted;
	};
	const fieldError = (field: Field, invalid: boolean) => {
		const target = focusTarget(field);
		if (invalid) target.setAttribute('aria-invalid', 'true');
		else target.removeAttribute('aria-invalid');
		const description = document.getElementById(`lead-${field.name}-error`);
		if (description) description.hidden = !invalid;
	};

	form.addEventListener('input', (event) => {
		const field = controls.find((control) => control === event.target);
		if (field) fieldError(field, false);
		if (!sending) requestId = '';
	});

	let widget: string;
	let turnstile: Turnstile;
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		if (sending || accepted || !proof || !form.reportValidity()) return;
		if (dropdown && !dropdown.input.value) {
			fieldError(dropdown.input, true);
			dropdown.trigger.focus();
			return;
		}
		const values: Record<string, string | boolean> = {};
		for (const field of controls) {
			fieldError(field, false);
			if (field instanceof HTMLInputElement && field.type === 'checkbox') {
				values[field.name] = field.checked;
			} else if (field.required || field.value.trim()) {
				values[field.name] = field.value.trim();
			}
		}
		requestId ||= crypto.randomUUID();
		sending = true;
		fields.disabled = true;
		updateSubmit();
		setStatus(copy.sending);
		status.focus();
		let firstInvalid: Field | undefined;
		try {
			const response = await fetch(LEAD_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'omit',
				redirect: 'error',
				body: JSON.stringify({ ...values, type, locale, requestId, turnstileToken: proof }),
				signal: AbortSignal.timeout(25_000),
			});
			const result = (await response.json()) as LeadResponse;
			if (response.status === 202 && result.ok === true && typeof result.correlationId === 'string') {
				accepted = true;
				form.reset();
				setStatus(copy.success, 'success');
				document.dispatchEvent(new CustomEvent('barq:lead-accepted', { detail: type }));
			} else if (result.ok === false) {
				setStatus(errorMessage(result.code, copy), 'error');
				if (result.code === 'invalid_input' && Array.isArray(result.fieldErrors)) {
					for (const field of controls.filter(({ name }) => result.fieldErrors?.includes(name))) {
						fieldError(field, true);
						firstInvalid ??= field;
					}
				}
			} else {
				setStatus(copy.failure, 'error');
			}
		} catch {
			setStatus(copy.failure, 'error');
		} finally {
			sending = false;
			proof = '';
			fields.disabled = accepted;
			updateSubmit();
			if (!accepted) {
				try {
					turnstile.reset(widget);
				} catch {
					setStatus(copy.unavailable, 'error');
				}
			}
			if (firstInvalid) {
				const target = focusTarget(firstInvalid);
				target.scrollIntoView({ block: 'nearest', behavior: 'instant' });
				target.focus({ preventScroll: true });
			}
		}
	});

	try {
		turnstile = await loadTurnstile();
		fields.disabled = false;
		widget = turnstile.render(challenge, {
			sitekey: form.dataset.siteKey,
			action: LEAD_TURNSTILE_ACTION,
			language: locale,
			size: challenge.clientWidth < 300 ? 'compact' : 'flexible',
			'response-field': false,
			callback: (token: string) => {
				proof = token;
				if (status.textContent === copy.preparing) setStatus('');
				updateSubmit();
			},
			'expired-callback': () => {
				proof = '';
				if (!sending && !accepted) setStatus(copy.bot, 'error');
				updateSubmit();
			},
			'error-callback': () => {
				proof = '';
				if (!sending && !accepted) setStatus(copy.unavailable, 'error');
				updateSubmit();
			},
		});
		if (type === 'consultation') {
			const selected = new URLSearchParams(location.search).get('service');
			if (selected) dropdown?.select(selected);
		}
	} catch {
		fields.disabled = true;
		setStatus(copy.unavailable, 'error');
	}
}
