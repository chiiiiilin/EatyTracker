<template>
	<teleport to="body">
		<div v-show="visible" class="toast toast-center toast-top z-[9999]">
			<div :class="['alert', alertType]">
				<span>{{ message }}</span>
			</div>
		</div>
	</teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref<'success' | 'error' | 'info'>('info');

const alertType = computed(() => {
	switch (type.value) {
		case 'success':
			return 'alert-success alert-soft';
		case 'error':
			return 'alert-error alert-soft';
		default:
			return 'alert-info alert-soft';
	}
});
const show = (
	msg: string,
	toastType: 'success' | 'error' | 'info' = 'info',
	duration = 2000
) => {
	message.value = msg;
	type.value = toastType;
	visible.value = true;

	setTimeout(() => {
		visible.value = false;
	}, duration);
};

defineExpose({ show });
</script>
