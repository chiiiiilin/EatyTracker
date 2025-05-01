<template>
	<nav
		class="fixed bg-neutral w-full max-w-md mx-auto bottom-0 pt-3 pb-8 box-border text-primary-content flex justify-evenly items-center left-1/2 -translate-x-1/2"
	>
		<NuxtLink
			v-for="item in navItems"
			:key="item.to"
			:to="item.to"
			class="item flex flex-col items-center p-2 rounded-full relative"
			:class="{
				'bg-primary-content text-neutral': route.path === item.to,
				'text-primary-content':
					route.path !== item.to && item.to !== '/diary/mealLog',
				'bg-secondary-content text-neutral':
					item.to === '/diary/mealLog',
			}"
		>
			<component :is="item.icon" :size="28" />
		</NuxtLink>
	</nav>
</template>

<script setup>
import {
	House,
	Plus,
	MessageCircle,
	ChartBarBig,
	Notebook,
} from 'lucide-vue-next';

import { useRoute } from 'vue-router';

const route = useRoute();

const navItems = computed(() => [
	{ icon: House, to: '/' },
	{ icon: Notebook, to: '/diary' },
	{ icon: Plus, to: '/diary/mealLog' },
	{ icon: MessageCircle, to: '/AIChat' },
	{ icon: ChartBarBig, to: '/tracking' },
]);
</script>

<style scoped></style>
