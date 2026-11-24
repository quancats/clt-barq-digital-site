import { describe, expect, it } from 'vitest';
import { badgeVariants, buttonLinkVariants, cardVariants } from '@/lib/ui/astroVariants';

describe('astroVariants', () => {
	it('builds button link variants', () => {
		expect(buttonLinkVariants({ variant: 'default', size: 'lg' })).toContain('bg-primary');
		expect(buttonLinkVariants({ variant: 'outline', size: 'sm' })).toContain('border-border');
		expect(buttonLinkVariants({ variant: 'ghost' })).toContain('hover:bg-muted');
		expect(buttonLinkVariants({ variant: 'link' })).toContain('underline-offset-4');
	});

	it('builds badge and card variants', () => {
		expect(badgeVariants({ variant: 'secondary' })).toContain('bg-secondary');
		expect(badgeVariants({ variant: 'outline' })).toContain('border-border');
		expect(cardVariants({ padding: 'lg' })).toContain('p-8');
		expect(cardVariants({ padding: 'default' })).toContain('bg-card');
	});
});
