<script setup lang="ts">
const authStore = useAuthStore();
onMounted(() => {
	authStore.fetchUser();
});
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<div class="flex-1 bg-base-200">
			<slot />
		</div>
		<TabBar />
	</div>
</template>

<style scoped></style>
