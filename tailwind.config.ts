// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
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
		themes: ['light', 'dark', 'corporate'],
	},
};

export default config;
