export default defineNuxtPlugin(async (nuxtApp) => {
	const authStore = useAuthStore();

	if (!authStore.user) {
		await authStore.fetchUser();
	}
});