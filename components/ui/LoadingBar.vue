<template>
	<div
		v-if="visible"
		class="fixed top-0 left-0 w-full h-1 z-[9999] bg-transparent"
	>
		<div
			:class="[
				'h-full transition-all duration-300 ease-out',
				{
					'bg-primary': state === 'loading',
					'bg-error': state === 'error',
				},
			]"
			:style="{ width: progress + '%' }"
		></div>
	</div>
</template>

<script setup lang="ts">
const visible = ref(false);
const progress = ref(0);
const state = ref<'loading' | 'done' | 'error'>('loading');
let timer: NodeJS.Timeout;
let minVisibleTime: number;

const start = () => {
	clearInterval(timer);
	visible.value = true;
	state.value = 'loading';
	progress.value = 0;
	minVisibleTime = Date.now();

	timer = setInterval(() => {
		if (progress.value < 90) {
			progress.value += Math.random() * 3;
		}
	}, 100);
};

const end = () => {
	const now = Date.now();
	const delay = Math.max(minVisibleTime - now, 0);

	setTimeout(() => {
		clearInterval(timer);
		progress.value = 100;
		setTimeout(() => {
			visible.value = false;
			progress.value = 0;
		}, 400);
	}, delay);
};

const error = () => {
	clearInterval(timer);
	state.value = 'error';
	progress.value = 100;

	setTimeout(() => {
		visible.value = false;
		progress.value = 0;
		state.value = 'loading';
	}, 800);
};

defineExpose({ start, end, error });
</script>
