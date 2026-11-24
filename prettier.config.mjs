/** @type {import('prettier').Config} */
export default {
	semi: true,
	useTabs: true,
	tabWidth: 4,
	singleQuote: true,
	printWidth: 9999,
	bracketSameLine: true,
	singleAttributePerLine: false,
	endOfLine: 'crlf',
	trailingComma: 'all',
	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	tailwindStylesheet: './src/styles/global.css',
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
};
