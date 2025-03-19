import { defineStore } from 'pinia';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('authStore', () => {
	const { $supabase }:any = useNuxtApp();
	const user = ref<User | null>(null);

	const fetchUser = async () => {
		const { data, error } = await $supabase.auth.getUser();
		if (data) user.value = data.user;
		if (error) console.error('無法獲取使用者資訊：', error);
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await $supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			console.error('登入失敗', error);
			return null;
		}
		user.value = data.user ?? null;
		return data.user;
	};

	const signOut = async () => {
		const { error } = await $supabase.auth.signOut();
		if (error) {
			console.error('登出失敗', error);
		} else {
			user.value = null;
		}
	};

	const signUp = async (email: string, password: string) => {
		const { data, error } = await $supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			console.error('註冊失敗', error);
			return null;
		}
		user.value = data.user ?? null;
		return data.user;
	};

	return { user, fetchUser, signIn, signOut, signUp };
});
