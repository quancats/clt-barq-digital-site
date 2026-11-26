/** GA4 Measurement ID pattern (`G-` + alphanumeric). */
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

/**
 * Returns true when `value` looks like a GA4 Measurement ID.
 */
export function isValidGoogleAnalyticsId(value: string | undefined | null): value is string {
	if (typeof value !== 'string') {
		return false;
	}

	return GA_MEASUREMENT_ID_PATTERN.test(value.trim());
}

/**
 * Parses the public enable flag. Defaults to enabled when unset.
 * Explicit `false` / `0` / `no` / `off` disables injection.
 */
export function isGoogleAnalyticsEnabled(value: string | boolean | undefined | null): boolean {
	if (typeof value === 'boolean') {
		return value;
	}

	if (value == null || value === '') {
		return true;
	}

	const normalized = String(value).trim().toLowerCase();
	return !['false', '0', 'no', 'off'].includes(normalized);
}

/**
 * Resolves the Measurement ID to inject for production builds when analytics is enabled
 * and a valid ID is configured. Development stays analytics-free.
 */
export function resolveGoogleAnalyticsId(options: { measurementId: string | undefined; isProd: boolean; enabled?: string | boolean | undefined }): string | null {
	if (!options.isProd) {
		return null;
	}

	if (!isGoogleAnalyticsEnabled(options.enabled)) {
		return null;
	}

	const measurementId = options.measurementId?.trim();
	if (!measurementId || !isValidGoogleAnalyticsId(measurementId)) {
		return null;
	}

	return measurementId;
}

/**
 * Builds the inline gtag bootstrap snippet for a validated Measurement ID.
 */
export function createGoogleAnalyticsInitScript(measurementId: string, canonicalPage?: string, locale: 'ar' | 'en' = 'ar'): string {
	const page = canonicalPage ? new URL(canonicalPage) : undefined;
	if (page) {
		page.search = '';
		page.hash = '';
		page.username = '';
		page.password = '';
	}
	const idLiteral = JSON.stringify(measurementId).replaceAll('<', '\\u003c');
	const pageLiteral = JSON.stringify(page?.href ?? '').replaceAll('<', '\\u003c');
	return `(()=>{
		window.dataLayer=window.dataLayer||[];
		function gtag(){window.dataLayer.push(arguments);}
		const common={page_location:${pageLiteral},page_referrer:'',language:${JSON.stringify(locale)}};
		gtag('js',new Date());
		gtag('config',${idLiteral},{...common,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
		function track(name, details={}){
			if(window.barqMayMeasure?.()) gtag('event',name,{...common,...details});
		}
		track('page_view');
		const allowedCtas=['bim_outbound','contact_action','consultation_cta','demo_cta','partnership_cta'];
		function trackLink(event){
			const action=event.target.closest?.('a[data-analytics-action]')?.dataset.analyticsAction;
			if(allowedCtas.includes(action)) track(action);
		}
		document.addEventListener('click',trackLink);
		document.addEventListener('auxclick',(event)=>{if(event.button===1)trackLink(event);});
		let converted=false;
		document.addEventListener('barq:lead-accepted',(event)=>{
			if(converted || !['general','consultation','demo','partnership'].includes(event.detail)) return;
			converted=true;
			track('lead_accepted',{lead_type:event.detail});
		});
	})();`;
}
