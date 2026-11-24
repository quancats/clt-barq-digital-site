export const catalogCategories = ['display', 'disclosure', 'forms', 'navigation', 'feedback'] as const;

export type CatalogCategory = (typeof catalogCategories)[number];

export interface CatalogComponent {
	id: string;
	category: CatalogCategory;
}

/**
 * Canonical registry for the public shadcn-vue catalog.
 * Keep this list complete: unit tests assert exact membership.
 */
export const catalogComponents = [
	{ id: 'accordion', category: 'disclosure' },
	{ id: 'alert', category: 'feedback' },
	{ id: 'alert-dialog', category: 'feedback' },
	{ id: 'aspect-ratio', category: 'display' },
	{ id: 'avatar', category: 'display' },
	{ id: 'badge', category: 'display' },
	{ id: 'button', category: 'display' },
	{ id: 'card', category: 'display' },
	{ id: 'carousel', category: 'display' },
	{ id: 'checkbox', category: 'forms' },
	{ id: 'collapsible', category: 'disclosure' },
	{ id: 'combobox', category: 'forms' },
	{ id: 'empty', category: 'display' },
	{ id: 'field', category: 'forms' },
	{ id: 'form', category: 'forms' },
	{ id: 'input', category: 'forms' },
	{ id: 'input-group', category: 'forms' },
	{ id: 'item', category: 'display' },
	{ id: 'label', category: 'forms' },
	{ id: 'native-select', category: 'forms' },
	{ id: 'navigation-menu', category: 'navigation' },
	{ id: 'number-field', category: 'forms' },
	{ id: 'pagination', category: 'navigation' },
	{ id: 'progress', category: 'feedback' },
	{ id: 'radio-group', category: 'forms' },
	{ id: 'select', category: 'forms' },
	{ id: 'sheet', category: 'navigation' },
	{ id: 'skeleton', category: 'feedback' },
	{ id: 'spinner', category: 'feedback' },
	{ id: 'stepper', category: 'forms' },
	{ id: 'switch', category: 'forms' },
	{ id: 'tabs', category: 'disclosure' },
	{ id: 'textarea', category: 'forms' },
	{ id: 'toast', category: 'feedback' },
	{ id: 'tooltip', category: 'feedback' },
] as const satisfies readonly CatalogComponent[];

export type CatalogComponentId = (typeof catalogComponents)[number]['id'];

export const catalogComponentIds = catalogComponents.map((component) => component.id);

export function getCatalogComponentsByCategory(category: CatalogCategory) {
	return catalogComponents.filter((component) => component.category === category);
}
