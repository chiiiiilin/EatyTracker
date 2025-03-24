import { defineStore } from 'pinia';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('authStore', () => {
	const { $supabase }: any = useNuxtApp();
	const user = ref<User | null>(null);
	const userProfile = ref<any>(null);

	const fetchUser = async () => {
		const { data: session } = await $supabase.auth.getUser();
		const authUser = session?.user;
		if (!authUser) return;

		user.value = authUser;

		// 抓取 users 資料表資料
		const { data: existingUser } = await $supabase
			.from('users')
			.select('*')
			.eq('id', authUser.id)
			.single();

		if (existingUser) {
			userProfile.value = existingUser;
		} else {
			const newUser = {
				id: authUser.id,
				email: authUser.email,
				display_name: authUser.user_metadata?.full_name || 'User',
				avatar_url:
					authUser.user_metadata?.avatar_url ||
					'https://i.pinimg.com/736x/bb/93/99/bb93993d644835d9aa673c760cad0585.jpg',
				created_at: new Date().toISOString(),
			};

			const { data: inserted, error: insertError } = await $supabase
				.from('users')
				.insert(newUser)
				.select()
				.single();

			if (!insertError) {
				userProfile.value = inserted;
			} else {
				console.error('寫入 userProfile 失敗', insertError);
			}
		}
	};

	const signInWithOAuth = async () => {
		const { data, error } = await $supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'http://localhost:3000/',
			},
		});
		if (error) {
			console.error('google 登入失敗', error);
			return null;
		}

		const { data: session } = await $supabase.auth.getUser();
		if (!session || !session.user) {
			console.error('無法取得登入使用者');
			return null;
		}

		const { id, email, user_metadata } = session.user;
		const display_name = user_metadata?.full_name || 'User';
		const avatar_url =
			user_metadata?.avatar_url ||
			'https://i.pinimg.com/736x/bb/93/99/bb93993d644835d9aa673c760cad0585.jpg';

		const { data: appUser } = await $supabase
			.from('users')
			.select('*')
			.eq('email', email)
			.single();

		if (!appUser) {
			const { error: insertError } = await $supabase
				.from('users')
				.insert({
					id,
					email,
					display_name,
					avatar_url,
					created_at: new Date().toISOString(),
				});

			if (insertError) {
				console.error('無法建立新使用者', insertError);
				return null;
			}
		}

		const { data: finalUser } = await $supabase
			.from('users')
			.select('*')
			.eq('email', email)
			.single();

		user.value = finalUser;

		setTimeout(() => {
			window.history.replaceState(
				{},
				document.title,
				window.location.pathname
			);
		}, 1000);

		return finalUser;
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
		try {
			const { error } = await $supabase.auth.signUp({ email, password });

			if (error) {
				if (error.message.includes('registered')) {
					return {
						success: false,
						error: '此帳號已存在，請前往登入',
					};
				}
				return { success: false, error: error.message };
			}

			return {
				success: true,
				message: '請至信箱驗證您的帳號',
			};
		} catch (error) {
			console.error('註冊發生錯誤', error);
			return {
				success: false,
				error: '發生未知錯誤，請稍後再試',
			};
		}
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await $supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			console.error('登入失敗', error);
			if (error.code === 'invalid_credentials') {
				return { success: false, error: '帳號或密碼錯誤' };
			} else if (error.code === 'email_not_confirmed') {
				const resendResult = await resendVerificationEmail(email);
				return {
					success: false,
					error: resendResult.success
						? resendResult.message
						: resendResult.error,
				};
			}
			return { success: false, error: error.message };
		}
		const userData = data.user;
		if (!userData) return { success: false, error: '無法獲取使用者資料' };

		const { data: existingUser, error: userCheckError } = await $supabase
			.from('users')
			.select('*')
			.eq('email', email)
			.single();

		if (!existingUser && userCheckError) {
			const { error: insertError } = await $supabase
				.from('users')
				.insert({
					id: userData.id,
					email: userData.email,
					display_name: 'User',
					avatar_url:
						'https://i.pinimg.com/736x/bb/93/99/bb93993d644835d9aa673c760cad0585.jpg',
					created_at: new Date().toISOString(),
				});

			if (insertError) {
				console.error('無法寫入使用者資料', insertError);
				return null;
			}
		}

		user.value = userData;
		return { success: true, user: userData };
	};

	const resendVerificationEmail = async (email: string) => {
		try {
			await $supabase.auth.resend({
				email,
				type: 'signup',
			});
			return {
				success: true,
				message: '驗證信已重新寄出，請至信箱完成驗證',
			};
		} catch (error) {
			console.error('補寄驗證信失敗', error);
			return {
				success: false,
				error: '補寄驗證信失敗，請稍後再試',
			};
		}
	};

	const updateUserProfile = async (payload: any) => {
		if (!user.value) return;
		const { error } = await $supabase
			.from('users')
			.update(payload)
			.eq('id', user.value.id);

		if (!error) {
			userProfile.value = { ...userProfile.value, ...payload };
			return {
				success: true,
				message: '已上傳個人圖片',
			};
		}
	};

	return {
		user,
		userProfile,
		fetchUser,
		signIn,
		signInWithOAuth,
		signOut,
		signUp,
		resendVerificationEmail,
		updateUserProfile,
	};
});
