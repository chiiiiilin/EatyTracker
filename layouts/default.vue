<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();

const hideTabBarPages = ['auth-login', 'auth-register'];
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<div class="flex-1 bg-base-200">
			<slot />
		</div>
		<TabBar v-if="!hideTabBarPages.includes(route.name as string)" />
	</div>
</template>

<style scoped></style>
