import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	if (!config.public.supabaseUrl || !config.public.supabaseKey) {
		throw new Error('Supabase 設定錯誤，請檢查 .env 是否正確讀取！');
	}
	const supabase = createClient(
		config.public.supabaseUrl,
		config.public.supabaseKey
	);

	nuxtApp.provide('supabase', supabase);
});
