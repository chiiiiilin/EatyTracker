// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'@pinia/nuxt',
		'shadcn-nuxt',
		'@vite-pwa/nuxt',
	],
	runtimeConfig: {
		public: {
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
		},
	},
	shadcn: {
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './components/ui',
	},
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: 'EatyTrack',
			short_name: 'EatyTrack',
			description: '卡路里追蹤與健康管理',
			theme_color: '#ffffff',
			background_color: '#ffffff',
			display: 'standalone',
			start_url: '/',
			icons: [
				{
					src: '/icon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
			],
		},
		workbox: {
			cleanupOutdatedCaches: true, // 自動清理舊快取
			clientsClaim: true, // 讓新的 Service Worker 立即生效
			skipWaiting: true, // 讓新的 Service Worker 立即接管
			runtimeCaching: [],
		},
		devOptions: {
			enabled: true,
			type: 'module',
			navigateFallback: '/',
		},
	},
});
