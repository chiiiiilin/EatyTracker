export default defineNuxtConfig({
	tailwindcss: {
		configPath: 'tailwind.config.ts',
		viewer: true,
	},
	watch: ['tailwind.config.js', 'assets/css/**/*'],
	devtools: { enabled: true },
	css: ['~/assets/css/tailwind.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	plugins: ['@/plugins/supabase.ts', '@/plugins/initAuth.ts'],
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
	runtimeConfig: {
		public: {
			supabaseUrl: process.env.SUPABASE_URL || '',
			supabaseKey: process.env.SUPABASE_KEY || '',
			supabaseRedirectUrl: process.env.NUXT_SUPABASE_REDIRECT_URL || '',
		},
	},
	app: {
		head: {
			title: 'EatyTracker',
			meta: [{ name: 'theme-color', content: '#ffffff' }],
			link: [
				{
					key: 'icon',
					rel: 'icon',
					type: 'image/png',
					href: '/icon-192x192.png',
				},
				{
					key: 'apple-touch-icon',
					rel: 'apple-touch-icon',
					href: '/icon-512x512.png',
				},
				{ rel: 'manifest', href: '/manifest.json' },
			],
		},
	},
});
