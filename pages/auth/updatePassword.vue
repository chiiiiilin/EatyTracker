<template>
	<div
		class="w-full rounded-t-3xl px-8 py-8 absolute bottom-0 z-50 bg-base-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]"
	>
		<h2 class="my-2">重設密碼</h2>
		<form @submit.prevent="submitEvent" class="flex flex-col">
			<label class="input input-lg w-full my-2">
				<KeyRound :size="18" class="mr-1" />
				<input
					type="password"
					placeholder="請設置八位數以上英數混和密碼"
					required
					v-model="user.password"
				/>
			</label>
			<label class="input input-lg w-full my-2">
				<KeyRound :size="18" class="mr-1" />
				<input
					type="password"
					placeholder="再次確認密碼"
					required
					v-model="user.dbCheckPassword"
				/>
			</label>
			<button class="btn btn-base-content mt-8 btn-xl">確認</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { KeyRound } from 'lucide-vue-next';
const { $supabase }: any = useNuxtApp();
const toast = useToast();
const loadingBar = useLoadingBar();

definePageMeta({
	layout: 'empty',
});

const user = ref({
	password: '',
	dbCheckPassword: '',
});

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const submitEvent = async () => {
	loadingBar.start();

	if (user.value.password !== user.value.dbCheckPassword) {
		toast.show('密碼不相符，請重新輸入!', 'error');
		return false;
	}

	if (!passwordRegex.test(user.value.password)) {
		toast.show('密碼必須至少8位，且包含英文字母與數字', 'error');
		return false;
	}

	try {
		const result = await $supabase.auth.updateUser(user.value.password);

		if (result.success) {
			loadingBar.end();
			toast.show('已更改，請重新登入', 'success');
		} else {
			loadingBar.error();
			toast.show('請稍後再試', 'error');
		}
	} catch (error) {
		loadingBar.error();
		console.error(error);
		toast.show('請稍後再試', 'error');
	}
};
</script>
