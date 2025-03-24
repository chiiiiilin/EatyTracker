<template>
	<nav
		class="fixed bg-neutral w-screen bottom-0 h-16 rounded-t-xl text-primary-content flex justify-evenly items-center"
	>
		<NuxtLink
			v-for="item in navItems"
			:key="item.to"
			:to="item.to"
			class="item flex flex-col items-center p-2 rounded-full"
			:class="{
				'bg-primary-content text-neutral': route.path === item.to,
				'text-primary-content': route.path !== item.to,
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

const navItems = [
	{ icon: House, to: '/' },
	{ icon: Cherry, to: '/food' },
	{ icon: Notebook, to: '/diary' },
	{ icon: ChartBarBig, to: '/tracking' },
	{ icon: Settings2, to: '/auth/profile' },
];
</script>

<style scoped></style>
