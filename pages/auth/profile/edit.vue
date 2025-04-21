<template>
	<div class="flex flex-col items-center top-5 relative">
		<UiBackButton />
		<h1 class="text-xl mb-16">編輯個人資料</h1>
		<AuthAvatar />
		<form class="w-full px-4 mt-5">
			<legend class="mt-3 mb-2 font-bold">電子郵件信箱</legend>
			<input
				v-model="userData.email"
				type="text"
				class="input input-bordered w-full"
				placeholder="填入您的電子郵件信箱"
				disabled
			/>
			<legend class="mt-3 mb-2 font-bold">使用者名稱</legend>
			<input
				v-model="userData.displayName"
				type="text"
				class="input input-bordered w-full"
				placeholder="填入您的使用者名稱"
			/>

			<legend class="mt-3 mb-2 font-bold">個性簽名</legend>
			<input
				v-model="userData.statusMessage"
				type="text"
				class="input input-bordered w-full"
				placeholder="寫點鼓勵自己的話吧!!"
			/>
			<legend class="mt-3 mb-2 font-bold">生日</legend>
			<input
				v-model="userData.birth"
				type="date"
				class="input input-bordered w-full"
				:min="'1900-01-01'"
				:max="today"
			/>
			<legend class="mt-3 mb-2 font-bold">生理性別</legend>
			<select class="select w-full" v-model="userData.gender">
				<option disabled selected>請選擇生理性別</option>
				<option value="male">男</option>
				<option value="female">女</option>
				<option value="others">其他</option>
			</select>
			<legend class="mt-3 mb-2 font-bold">身高</legend>
			<input
				v-model="userData.height"
				type="number"
				class="input input-bordered w-full"
				placeholder="請填入身高"
			/>
			<legend class="mt-3 mb-2 font-bold">初始體重</legend>
			<input
				v-model="userData.initWeight"
				type="number"
				class="input input-bordered w-full"
				placeholder="請填入開始減脂前的體重"
			/>
			<legend class="mt-3 mb-2 font-bold">目標體重</legend>
			<input
				v-model="userData.targetWeight"
				type="number"
				class="input input-bordered w-full"
				placeholder="請填入目標體重"
			/>
			<legend class="mt-3 mb-2 font-bold">健身目標</legend>
			<select class="select w-full" v-model="userData.fitnessGoal">
				<option disabled selected>健身目標</option>
				<option value="cutting">減脂</option>
				<option value="maintaining">維持</option>
				<option value="bulking">增肌</option>
			</select>
			<legend class="mt-3 mb-2 font-bold">活動量</legend>
			<select class="select w-full" v-model="userData.activityLevel">
				<option disabled selected>活動量</option>
				<option value="sedentary">久坐: 大多時間坐著，不太運動</option>
				<option value="light">
					輕度活動: 偶爾散步、做家事，每週運動 1～2 天
				</option>
				<option value="moderate">
					中度活動: 每週運動 3～4 天，有走動的工作
				</option>
				<option value="active">
					高度活動: 每週運動 5～6 天，身體活動多
				</option>
				<option value="very_active">
					非常活躍: 高強度訓練、體力勞動者
				</option>
			</select>
			<legend class="mt-3 mb-2 font-bold">熱量目標</legend>
			<input
				v-model="userData.calorieTarget"
				type="number"
				class="input input-bordered w-full"
				placeholder="請填入熱量目標"
			/>
			<button
				class="btn btn-primary w-full my-5"
				@click.prevent="submitProfile"
			>
				儲存變更
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { UiBackButton } from '#components';
import { useRouter } from 'vue-router';
const toast = useToast();
const loadingBar = useLoadingBar();
const router = useRouter();
const authStore = useAuthStore();

const userData = ref({
	email: '',
	displayName: '',
	statusMessage: '',
	birth: null,
	gender: '',
	height: null,
	fitnessGoal: '',
	activityLevel: '',
	calorieTarget: null,
	initWeight: null,
	targetWeight: null,
});
const today = new Date().toISOString().split('T')[0];

onMounted(() => {
	if (authStore.userProfile) {
		userData.value = {
			email: authStore.userProfile.email || '',
			displayName: authStore.userProfile.display_name || '',
			statusMessage: authStore.userProfile.status_message || '',
			birth: authStore.userProfile.birth || null,
			gender: authStore.userProfile.gender || '',
			height: authStore.userProfile.height || null,
			fitnessGoal: authStore.userProfile.fitness_goal || '',
			activityLevel: authStore.userProfile.activity_level || '',
			calorieTarget: authStore.userProfile.calorie_target || null,
			initWeight: authStore.userProfile.init_weight || null,
			targetWeight: authStore.userProfile.target_weight || null,
		};
	}
});
const submitProfile = async () => {
	loadingBar.start();

	const payload = {
		display_name: userData.value.displayName,
		status_message: userData.value.statusMessage,
		birth: userData.value.birth,
		gender: userData.value.gender,
		height: userData.value.height,
		fitness_goal: userData.value.fitnessGoal,
		activity_level: userData.value.activityLevel,
		calorie_target: userData.value.calorieTarget,
		init_weight: userData.value.initWeight,
		target_weight: userData.value.targetWeight,
	};
	try {
		const result = await authStore.updateUserProfile(payload);
		if (!result?.success) throw new Error('更新 users 失敗');

		await authStore.createUserGoalLog({
			calorie_target: payload.calorie_target,
			protein_target: authStore.userProfile.protain_target,
			fat_target: authStore.userProfile.fat_target,
			carb_target: authStore.userProfile.carb_target,
			fitness_goal: payload.fitness_goal,
			activity_level: payload.activity_level,
		});

		loadingBar.end();
		router.push('/auth/profile');
	} catch (error) {
		loadingBar.error();
		toast.show('發生錯誤，請稍後再試', 'error');
	}
};
</script>

<style scoped></style>
