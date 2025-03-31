<template>
	<div class="px-4 flex flex-col items-center">
		<div class="mt-16 mb-8 flex justify-start w-full relative">
			<div class="mr-8"><AuthAvatar /></div>
			<div>
				<div class="flex items-center">
					<div>
						<p
							class="text-3xl"
							v-if="authStore.userProfile.display_name"
						>
							{{ authStore.userProfile.display_name }}
						</p>
						<div class="skeleton h-10 w-16" v-else></div>
					</div>
					<LogOut
						:size="14"
						class="mx-2 cursor-pointer mb-[-5px]"
						v-if="authStore.userProfile.display_name"
						@click="logout()"
					/>
				</div>
				<span class="block" v-if="authStore.userProfile.status_message">
					{{ authStore.userProfile.status_message }}
				</span>
				<div class="skeleton h-6 w-48 mt-3" v-else></div>
				<NuxtLink
					v-if="authStore.userProfile.status_message"
					class="btn btn-outline btn-wide btn-primary btn-sm mt-2"
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
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
const router = useRouter();
const toast = useToast();
const loadingBar = useLoadingBar();
const authStore = useAuthStore();
const { $supabase }: any = useNuxtApp();

const logout = async () => {
	loadingBar.start();
	const { error } = await $supabase.auth.signOut();

	if (!error) {
		loadingBar.end();
		router.push('/auth/login');
	} else {
		loadingBar.error();
		console.error('登出失敗:', error.message);
		toast.show('登出失敗', 'error');
	}
};
</script>

<style scoped></style>
