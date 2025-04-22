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
					route.path !== item.to &&
					item.to !== '/diary/mealLog' &&
					item.to !== '/tracking/bodyLog',
				'bg-secondary-content text-neutral':
					item.to === '/diary/mealLog' ||
					item.to === '/tracking/bodyLog',
			}"
		>
			<component :is="item.icon" :size="28" />
		</NuxtLink>
	</nav>
</template>

<script setup>
import {
	House,
	PencilLine,
	Cherry,
	ChartBarBig,
	Settings2,
	Notebook,
} from 'lucide-vue-next';

import { useRoute } from 'vue-router';

const route = useRoute();

const navItems = computed(() => [
	{ icon: House, to: '/' },
	{ icon: Cherry, to: '/food' },
	{
		icon: route.path === '/diary' ? PencilLine : Notebook,
		to: route.path === '/diary' ? '/diary/mealLog' : '/diary',
	},
	{
		icon: route.path === '/tracking' ? PencilLine : ChartBarBig,
		to: route.path === '/tracking' ? '/tracking/bodyLog' : '/tracking',
	},
	{ icon: Settings2, to: '/auth/profile' },
]);
</script>

<style scoped></style>
