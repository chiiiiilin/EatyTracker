<template>
	<div
		class="w-full rounded-t-3xl px-8 py-8 absolute bottom-0 z-50 bg-base-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]"
	>
		<h2 class="my-2">登入</h2>
		<form @submit.prevent="submitEvent" class="flex flex-col">
			<label class="input input-lg w-full my-2">
				<Mail :size="18" class="mr-1" />
				<input
					type="email"
					placeholder="電子郵件"
					required
					v-model="user.email"
				/>
			</label>
			<label class="input input-lg w-full my-2">
				<KeyRound :size="18" class="mr-1" />
				<input
					type="password"
					placeholder="密碼"
					required
					v-model="user.password"
				/>
			</label>
			<span class="text-right cursor-pointer" @click="forgetPassword()"
				>忘記密碼?</span
			>
			<button class="btn btn-base-content mt-8 btn-xl">登入</button>
		</form>
		<div class="divider my-8">或</div>
		<button
			class="btn btn-base-content w-full"
			@click="authStore.signInWithOAuth()"
		>
			<svg
				aria-label="Google logo"
				width="16"
				height="16"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<g>
					<path d="m0 0H512V512H0" fill="#fff"></path>
					<path
						fill="#34a853"
						d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
					></path>
					<path
						fill="#4285f4"
						d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
					></path>
					<path
						fill="#fbbc02"
						d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
					></path>
					<path
						fill="#ea4335"
						d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
					></path>
				</g>
			</svg>
			使用 Google 登入
		</button>
		<NuxtLink to="/auth/register" class="flex justify-center my-3"
			>還沒有帳號?點此註冊</NuxtLink
		>
	</div>
</template>

<script setup lang="ts">
import { Mail } from 'lucide-vue-next';
import { KeyRound } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
const { $supabase }: any = useNuxtApp();
const router = useRouter();
const config = useRuntimeConfig().public.supabaseRedirectUrl;
const authStore = useAuthStore();
const toast = useToast();
const loadingBar = useLoadingBar();

definePageMeta({
	layout: 'empty',
});

const user = ref({
	email: '',
	password: '',
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submitEvent = async () => {
	loadingBar.start();
	if (!emailRegex.test(user.value.email)) {
		toast.show('請輸入正確的電子郵件信箱', 'error');
		return false;
	}

	try {
		const result = await authStore.signIn(
			user.value.email,
			user.value.password
		);

		if (result?.success) {
			loadingBar.end();
			await navigateTo('/');
		} else {
			loadingBar.error();
			toast.show(result?.error, 'error');
		}
	} catch (error) {
		loadingBar.error();
		console.error(error);
		toast.show('登入失敗，請稍後再試', 'error');
	}
};

const forgetPassword = async () => {
	if (!emailRegex.test(user.value.email)) {
		toast.show('請輸入正確的電子郵件信箱', 'error');
		return false;
	}
	loadingBar.start();
	try {
		const { error } = await $supabase.auth.resetPasswordForEmail(
			user.value.email,
			{
				redirectTo: `${config}auth/updatePassword`,
			}
		);

		if (!error) {
			loadingBar.end();
			toast.show('請至email收信', 'info');
			router.push('/auth/login');
		} else {
			loadingBar.error();
			toast.show('請稍後再試', 'error');
		}
	} catch (error) {
		loadingBar.error();
		toast.show('請稍後再試', 'error');
	}
};
</script>
