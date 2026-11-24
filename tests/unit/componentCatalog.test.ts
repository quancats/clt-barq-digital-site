import { describe, expect, it } from 'vitest';
import { catalogCategories, catalogComponentIds, catalogComponents, getCatalogComponentsByCategory } from '@/lib/ui/componentCatalog';

const expectedIds = ['accordion', 'alert', 'alert-dialog', 'aspect-ratio', 'avatar', 'badge', 'button', 'card', 'carousel', 'checkbox', 'collapsible', 'combobox', 'empty', 'field', 'form', 'input', 'input-group', 'item', 'label', 'native-select', 'navigation-menu', 'number-field', 'pagination', 'progress', 'radio-group', 'select', 'sheet', 'skeleton', 'spinner', 'stepper', 'switch', 'tabs', 'textarea', 'toast', 'tooltip'] as const;

describe('component catalog registry', () => {
	it('contains exactly the approved 35 components without duplicates', () => {
		expect(catalogComponentIds).toHaveLength(35);
		expect(new Set(catalogComponentIds).size).toBe(35);
		expect([...catalogComponentIds].sort()).toEqual([...expectedIds].sort());
	});

	it('assigns every component to a known category', () => {
		for (const component of catalogComponents) {
			expect(catalogCategories).toContain(component.category);
		}
	});

	it('groups components by category without dropping entries', () => {
		const regrouped = catalogCategories.flatMap((category) => getCatalogComponentsByCategory(category));
		expect(regrouped).toHaveLength(catalogComponents.length);
	});
});
