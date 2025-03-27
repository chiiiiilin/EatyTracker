<template>
	<div class="px-4 flex flex-col items-center">
		<div class="mt-16 mb-8 flex justify-start w-full">
			<div class="mr-8"><AuthAvatar /></div>
			<div>
				<p class="text-3xl" v-if="authStore.userProfile.display_name">
					{{ authStore.userProfile.display_name }}
				</p>
				<div class="skeleton h-10 w-16" v-else></div>
				<span class="block" v-if="authStore.userProfile.status_message">
					{{ authStore.userProfile.status_message }}
				</span>
				<div class="skeleton h-6 w-48 mt-3" v-else></div>
				<NuxtLink
					v-if="authStore.userProfile.status_message"
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
const toast = useToast();
const authStore = useAuthStore();
const { $supabase }: any = useNuxtApp();
</script>

<style scoped></style>
