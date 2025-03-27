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
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vite-pwa/nuxt'],
	runtimeConfig: {
		public: {
			supabaseUrl: process.env.SUPABASE_URL || '',
			supabaseKey: process.env.SUPABASE_KEY || '',
			supabaseRedirectUrl: process.env.NUXT_SUPABASE_REDIRECT_URL || '',
		},
	},
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: 'EatyTracker',
			short_name: 'EatyTracker',
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
			disableDevLogs: true, // 停用 Workbox 開發日誌
			runtimeCaching: [], // 移除快取策略
			navigateFallback: null, // 避免 Workbox 攔截所有請求
		},
		devOptions: {
			enabled: false,
			type: 'module',
			navigateFallback: '/',
		},
	},
});
