export const previewAssets = ['/images/og/default.png'];

export function isPreviewAsset(path: string): boolean {
	return previewAssets.includes(path);
}
