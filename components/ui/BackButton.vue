<template>
	<button class="btn btn-ghost absolute top-3 left-1 z-[999]" @click="goBack">
		<ChevronLeft class="w-6" />
	</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ChevronLeft } from 'lucide-vue-next';

const router = useRouter();

const goBack = () => {
	const route = useRoute();
	const segments = route.path.split('/');
	segments.pop();
	const parentPath = segments.join('/') || '/';
	router.push(parentPath);
};
</script>
