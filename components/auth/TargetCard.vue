<template>
	<div
		class="mx-auto w-full"
		v-if="Object.keys(authStore.userProfile).length !== 0"
	>
		<NuxtLink
			class="bg-base-100 shadow-md rounded-2xl p-2 flex cursor-pointer"
			to="/auth/profile/setTarget"
		>
			<div
				class="relative w-1/3 flex flex-col items-center text-center border-r"
			>
				<div class="absolute top-0 right-2">
					<BicepsFlexed :size="20" />
				</div>
				<p class="text-3xl text-primary mt-5 mb-2 break-words">
					{{ fitnessGoal }}
				</p>
				<p class="text-base-content text-sm">健身目標</p>
			</div>
			<div
				class="relative w-1/3 flex flex-col items-center text-center border-r"
			>
				<div class="absolute top-0 right-2">
					<Flame :size="20" />
				</div>
				<p class="text-3xl text-secondary mt-5 mb-2">
					{{ calorieTarget }}
				</p>
				<p class="text-base-content text-sm">目標卡路里</p>
			</div>
			<div class="relative w-1/3 flex flex-col items-center text-center">
				<div class="absolute top-0 right-2">
					<Dumbbell :size="20" />
				</div>
				<p class="text-3xl text-primary mt-5 mb-3">
					{{ activityLevel }}
				</p>
				<p class="text-base-content text-sm">活動量</p>
			</div>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { BicepsFlexed, Flame, Dumbbell } from 'lucide-vue-next';
const authStore = useAuthStore();

const activityLevel = computed(() => {
	const map: Record<string, string> = {
		sedentary: '久坐',
		light: '輕度',
		moderate: '中度',
		active: '高度',
		very_active: '非常活躍',
	};
	return map[authStore.userProfile.activity_level] || '未設定';
});

const calorieTarget = authStore.userProfile.calorie_target || '未設定';

const fitnessGoal = computed(() => {
	const map: Record<string, string> = {
		cutting: '減脂',
		maintaining: '維持',
		bulking: '增肌',
	};
	return map[authStore.userProfile.fitness_goal] || '未設定';
});
</script>

<style scoped></style>
