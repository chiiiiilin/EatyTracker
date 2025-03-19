<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
<script setup>
import { useHead } from '#imports';

useHead({
	htmlAttrs: { 'data-theme': 'pastel' },
	meta: [
		{
			name: 'viewport',
			content:
				'width=375, initial-scale=1, maximum-scale=1, user-scalable=no',
		},
	],
});
</script>
<style>
@import '@/assets/fonts/font.css';
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;500;700&family=Noto+Sans+TC:wght@300;500;700&display=swap');

body {
	font-family: 'jf-openhuninn', 'Noto Sans Traditional Chinese';
	font-size: 16px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeLegibility;
}
</style>
