# Recipe: Content consistency gate

## Entry conditions

- The adopting project has documented content invariants (status enums, required bilingual pairs, banned promo phrases, etc.).
- You want a dedicated `test:content` / `verify:content` gate separate from Vitest unit tests and Playwright.

## Goals

- Fail CI when content contracts drift.
- Keep domain rules in the adopting project — do not copy another site’s slugs or regex YAML parser into the template.

## Suggested approach

1. Prefer Content Collections / typed data modules over hand-rolled frontmatter parsing.
2. Put invariants next to the owning domain (`src/lib/content/.../consistency.ts`).
3. Expose `npm run verify:content` (or `test:content`) that exits non-zero on contract failures.
4. Distinguish hard failures from informational reports.
5. Document the contract in `docs/system` / content ownership maps.

## Acceptance checks

- Invariants come from project docs, not tribal knowledge
- Missing required locale pairs fail loudly
- No accidental PII assertions in logs
- Gate runs after content changes without requiring a browser

## Out of scope

- Shipping Quancats-specific work-slug / HirzHub / promotional phrase rules in the shared template

## Validate localized records

Run the check on the validated published records before generating pages. Use the same stable `translationGroup` in both languages. Keep intentionally single-language records in an explicit list owned by the project. Use project-required fields in place of the example fields.

```js
export function verifyLocalizedRecords(records, singleLanguage = new Map()) {
	const locales = ['ar', 'en'];
	const groups = new Map();
	for (const record of records) {
		const { locale, translationGroup, title, description } = record;
		if (!locales.includes(locale) || [translationGroup, title, description].some((value) => typeof value !== 'string' || !value.trim())) {
			throw new Error('Invalid localized record in ' + locale);
		}
		const found = groups.get(translationGroup) ?? new Set();
		if (found.has(locale)) throw new Error('Duplicate locale for ' + translationGroup);
		found.add(locale);
		groups.set(translationGroup, found);
	}

	for (const [group, found] of groups) {
		const expected = singleLanguage.has(group) ? [singleLanguage.get(group)] : locales;
		if (found.size !== expected.length || expected.some((locale) => !found.has(locale))) {
			throw new Error('Locale mismatch for ' + group);
		}
	}
	for (const group of singleLanguage.keys()) {
		if (!groups.has(group)) throw new Error('Stale single-language exception ' + group);
	}
}
```

For example, use `new Map([['community-notice', 'ar']])` for an Arabic-only notice. Test complete pairs, missing translations, duplicate locale entries, incomplete copy and stale exceptions. Add this command to the adopting project's gate only when it owns these rules.
