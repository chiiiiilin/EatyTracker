<template>
	<div class="px-8 flex flex-col items-center">
		<div class="my-16 flex justify-start w-full">
			<div class="avatar mr-8">
				<div
					class="mask mask-squircle w-24 cursor-pointer"
					@click="triggerFileInput"
				>
					<img :src="authStore.userProfile.avatar_url" />
				</div>
			</div>
			<input
				type="file"
				accept="image/*"
				ref="fileInput"
				@change="uploadAvatar"
				class="hidden"
			/>
			<p class="text-3xl">
				{{ authStore.userProfile.display_name }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
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
