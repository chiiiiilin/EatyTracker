<template>
	<ClientOnly>
		<UiToast ref="toastRef" />
		<UiLoadingBar ref="loadingBarRef" />
	</ClientOnly>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup>
import UiToast from '@/components/ui/Toast.vue';
import UiLoadingBar from '@/components/ui/LoadingBar.vue';
import { useHead } from '#imports';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const toastRef = ref(null);
provide('toast', toastRef);

const loadingBarRef = ref(null);
provide('loadingBar', loadingBarRef);

useHead({
	htmlAttrs: { 'data-theme': 'pastel' },
	meta: [
		{
			name: 'viewport',
			content:
				'width=375, initial-scale=1, maximum-scale=1, user-scalable=no',
		},
	],
});

const isAuthChecked = ref(false);

const { data: userProfileData } = await useAsyncData('fetch-user', async () => {
	await authStore.fetchUser();
	isAuthChecked.value = true;

	return authStore.userProfile || {};
});

onMounted(() => {
	const isLoggedIn = !!authStore.user;
	if (
		!isLoggedIn &&
		route.path !== '/auth/login' &&
		route.path !== '/auth/register' &&
		route.path !== '/auth/updatePassword'
	) {
		router.replace('/auth/login');
	}
	if (
		isLoggedIn &&
		(route.path === '/auth/login' || route.path === '/auth/register')
	) {
		router.replace('/auth/profile');
	}
});
</script>

<style>
@import '@/assets/fonts/font.css';
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500;700&family=Noto+Sans+TC:wght@300;500;700&display=swap');

body {
	font-family: 'jf-openhuninn', 'Noto Sans Traditional Chinese';
	font-size: 16px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeLegibility;
}
</style>
