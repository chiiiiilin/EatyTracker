/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./app.vue',
		'./nuxt.config.ts',
		'./assets/**/*.{css,scss}',
	],
	plugins: [require('tailwindcss-animate'), require('daisyui')],
	daisyui: {
		themes: ['light', 'dark', 'pastel'],
	},
};
