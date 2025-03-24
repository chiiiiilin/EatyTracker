// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();

	if (!authStore.user) {
		await authStore.fetchUser();
	}

	const isLoggedIn = !!authStore.user;

	if (
		!isLoggedIn &&
		to.path !== '/auth/login' &&
		to.path !== '/auth/register'
	) {
		return navigateTo('/auth/login');
	}
	if (isLoggedIn && (to.path === '/auth/login' || to.path === '/register')) {
		return navigateTo('/auth/profile');
	}
});
