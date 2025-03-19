<template>
	<nav
		class="fixed bg-neutral w-screen bottom-0 h-16 rounded-t-xl text-primary-content flex justify-evenly items-center"
	>
		<House :size="28" />
		<Cherry :size="28" />
		<Notebook :size="28" />
		<!-- <PencilLine :size="28" /> -->
		<ChartBarBig :size="28" />
		<Settings2 :size="28" />
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
</script>

<style lang="scss" scoped></style>
