/**
 * Astro components approved for import inside repository MDX articles.
 * Keep this list small and review any addition.
 * tests/integration/mdxAllowlist.test.ts enforces this policy in CI.
 */
export const mdxAllowlistedComponents = ['@/components/astro/content/Callout.astro'] as const;

export type MdxAllowlistedComponent = (typeof mdxAllowlistedComponents)[number];
