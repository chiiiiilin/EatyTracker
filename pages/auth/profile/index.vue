<template>
	<div class="px-8 flex flex-col items-center">
		<div class="mt-16 mb-8 flex justify-start w-full">
			<div class="mr-8"><AuthAvatar /></div>
			<div>
				<p class="text-3xl">
					{{ authStore.userProfile.display_name }}
				</p>
				<span class="block">
					{{ authStore.userProfile.status_message }}
				</span>
				<NuxtLink
					class="btn btn-outline btn-primary btn-sm mt-2"
					to="/auth/profile/edit"
				>
					編輯檔案
				</NuxtLink>
			</div>
		</div>
		<AuthTargetCard />
	</div>
</template>

<script setup lang="ts">
import { AuthTargetCard } from '#components';

const toast = useToast();
const authStore = useAuthStore();
const { $supabase }: any = useNuxtApp();
</script>

<style scoped></style>
