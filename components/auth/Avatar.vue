<template>
	<div class="avatar">
		<div
			class="mask mask-squircle w-24 cursor-pointer relative"
			@click="triggerFileInput"
		>
			<img
				v-if="authStore.userProfile?.avatar_url"
				:src="authStore.userProfile.avatar_url"
				alt="avatar"
			/>
			<div v-else class="skeleton w-24 h-24"></div>
		</div>
		<div
			v-if="authStore.userProfile?.avatar_url"
			class="bg-base-300 text-base-content absolute p-1 rounded-full right-0 bottom-0 cursor-pointer"
		>
			<Camera :size="16" />
		</div>
	</div>
	<input
		v-if="authStore.userProfile?.avatar_url"
		type="file"
		accept="image/*"
		ref="fileInput"
		@change="uploadAvatar"
		class="hidden"
	/>
</template>

<script setup lang="ts">
import { Camera } from 'lucide-vue-next';
const toast = useToast();
const authStore = useAuthStore();
const fileInput = ref<HTMLInputElement | null>(null);
const { $supabase }: any = useNuxtApp();

const triggerFileInput = () => {
	fileInput.value?.click();
};
const uploadAvatar = async (e: Event) => {
	const target = e.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file || !authStore.user?.id) return;

	const fileExt = file.name.split('.').pop();
	const filePath = `${authStore.user.id}/${Date.now()}.${fileExt}`;

	const { error: uploadError } = await $supabase.storage
		.from('avatars')
		.upload(filePath, file);

	if (uploadError) {
		console.error('上傳失敗', uploadError);
		return;
	}

	const { data: publicUrlData } = $supabase.storage
		.from('avatars')
		.getPublicUrl(filePath);

	const publicUrl = publicUrlData.publicUrl;

	const result = await authStore.updateUserProfile({
		avatar_url: publicUrl,
	});

	if (!result?.success) {
		toast.show('請稍後再試', 'error');
		console.error('更新失敗');
	}
};
</script>

<style scoped></style>
