<template>
	<div class="relative w-fit">
		<div
			class="w-32 h-32 cursor-pointer relative bg-base-200 flex items-center justify-center border rounded-xl overflow-hidden"
			@click="triggerFileInput"
		>
			<img
				v-if="url"
				:src="url"
				alt="image"
				class="w-full h-full object-contain"
			/>
			<div
				v-else
				class="w-full h-full opacity-30 flex items-center justify-center text-sm text-base-content"
			>
				<Camera :size="32" />
			</div>
		</div>
		<div
			v-if="url"
			class="bg-base-300 text-base-content absolute p-1 rounded-full right-[-5px] top-[-5px] cursor-pointer"
			@click="clearImage"
		>
			<X :size="16" />
		</div>
		<input
			type="file"
			accept="image/*"
			ref="fileInput"
			@change="handleUpload"
			class="hidden"
		/>
	</div>
</template>

<script setup lang="ts">
import { Camera, X } from 'lucide-vue-next';

const fileInput = ref<HTMLInputElement | null>(null);

const props = defineProps<{
	path: string;
}>();

const emit = defineEmits(['update:file', 'update:url']);

const triggerFileInput = () => {
	fileInput.value?.click();
};

const handleUpload = (e: Event) => {
	const target = e.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		emit('update:file', file);
		emit('update:url', URL.createObjectURL(file));
	}
};

const clearImage = () => {
	emit('update:file', null);
	emit('update:url', null);
	if (fileInput.value) fileInput.value.value = '';
};


const url = defineModel<string | null>('url');
</script>
