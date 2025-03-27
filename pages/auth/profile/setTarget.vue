<template>
	<UiBackButton />
	<div class="flex flex-col items-center top-5 relative">
		<h1 class="text-xl mb-8">設置個人目標</h1>
		<ul class="steps mb-10">
			<li class="step" :class="{ 'step-primary': currentStep >= 0 }">
				基本資料
			</li>
			<li class="step" :class="{ 'step-primary': currentStep >= 1 }">
				目標設定
			</li>
			<li class="step" :class="{ 'step-primary': currentStep >= 2 }">
				活動量評估
			</li>
			<li class="step" :class="{ 'step-primary': currentStep >= 3 }">
				確認
			</li>
		</ul>
	</div>

	<div class="max-w-md mx-auto w-full space-y-6 p-5 relative">
		<!-- Step 1: 基本資料 -->
		<div v-if="currentStep === 0" class="space-y-4">
			<div>
				<label class="label">生理性別</label>
				<select
					v-model="form.gender"
					class="select select-bordered w-full"
				>
					<option disabled value="">請選擇</option>
					<option value="male">男性</option>
					<option value="female">女性</option>
					<option value="others">其他</option>
				</select>
			</div>
			<div>
				<label class="label">生日</label>
				<input
					v-model="form.birth"
					type="date"
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="label">身高（cm）</label>
				<input
					v-model="form.height"
					type="number"
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="label">體重（kg）</label>
				<input
					v-model="form.weight"
					type="number"
					class="input input-bordered w-full"
				/>
			</div>
		</div>

		<!-- Step 2: 目標設定 -->
		<div v-if="currentStep === 1" class="space-y-4">
			<div>
				<label class="label">你的目標是？</label>
				<select
					v-model="form.fitnessGoal"
					class="select select-bordered w-full"
				>
					<option disabled value="">請選擇</option>
					<option value="cutting">減脂</option>
					<option value="maintaining">維持體態</option>
					<option value="bulking">增肌</option>
				</select>
			</div>
			<div>
				<label class="label">理想體重（kg）</label>
				<input
					v-model="form.targetWeight"
					type="number"
					class="input input-bordered w-full"
				/>
			</div>
			<div>
				<label class="label">想達成目標的時間（週）</label>
				<input
					v-model="form.durationWeeks"
					type="number"
					class="input input-bordered w-full"
					placeholder="一年為48週"
				/>
			</div>
		</div>

		<!-- Step 3: 活動量 -->
		<div v-if="currentStep === 2" class="space-y-4">
			<div>
				<label class="label">每週運動頻率</label>
				<select
					v-model="form.exercise"
					class="select select-bordered w-full"
				>
					<option disabled value="">請選擇</option>
					<option value="rarely">幾乎不運動</option>
					<option value="occasionally">1~3 天</option>
					<option value="often">3~5 天</option>
					<option value="usually">幾乎每天運動</option>
				</select>
			</div>
			<div>
				<label class="label">工作型態</label>
				<select
					v-model="form.workStyle"
					class="select select-bordered w-full"
				>
					<option disabled value="">請選擇</option>
					<option value="sedentary">久坐</option>
					<option value="light">經常站立或走動</option>
					<option value="active">體力勞動</option>
				</select>
			</div>
			<p v-if="showActivityLevel" class="font-bold text-primary py-3">
				您的活動量分級為: {{ showActivityLevel }}
			</p>
		</div>

		<!-- Step 4: 確認 -->
		<div v-if="currentStep === 3">
			<h2 class="text-lg font-semibold my-2">建議熱量與營養素攝取</h2>
			<table class="table w-full">
				<thead>
					<tr>
						<th>營養素</th>
						<th>
							<p
								v-if="isMacrosEdited"
								class="text-secondary cursor-pointer"
								@click="resetMacros"
							>
								點此恢復建議比例 (%)
							</p>
							<p v-else>建議比例 (%)</p>
						</th>
						<th>攝取量 (g)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>總熱量</td>
						<td colspan="2">
							<div class="relative w-full max-w-xs">
								<input
									v-model.number="macroInput.calorie"
									type="number"
									class="input input-bordered w-full pr-12"
									@input="isCalorieEdited = true"
								/>
								<span
									class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
									>kcal／天</span
								>
							</div>
							<p
								class="text-sm text-gray-500 mt-2 whitespace-pre-line"
							>
								{{ calorieRangeText }}
							</p>
						</td>
					</tr>
					<tr>
						<td>蛋白質</td>
						<td>
							<div class="relative w-full max-w-xs">
								<input
									v-model.number="macroInput.ratio.protein"
									type="number"
									class="input input-bordered w-full max-w-xs"
									@input="isMacrosEdited = true"
								/>
								<span
									class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
									>%</span
								>
							</div>
						</td>
						<td>{{ macroGrams.protein }} g</td>
					</tr>
					<tr>
						<td>脂肪</td>
						<td>
							<div class="relative w-full max-w-xs">
								<input
									v-model.number="macroInput.ratio.fat"
									type="number"
									class="input input-bordered w-full max-w-xs"
									@input="isMacrosEdited = true"
								/>
								<span
									class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
									>%</span
								>
							</div>
						</td>
						<td>{{ macroGrams.fat }} g</td>
					</tr>
					<tr>
						<td>碳水</td>
						<td>
							<div class="relative w-full max-w-xs">
								<input
									v-model.number="macroInput.ratio.carb"
									type="number"
									class="input input-bordered w-full max-w-xs"
									@input="isMacrosEdited = true"
								/>
								<span
									class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
									>%</span
								>
							</div>
						</td>
						<td>{{ macroGrams.carb }} g</td>
					</tr>
				</tbody>
			</table>
			<p v-if="isRatioInvalid" class="text-error text-sm mt-2">
				比例總和必須是 100%，目前為 {{ totalRatio }}%
			</p>
			<p class="font-bold text-primary py-3">
				{{ estimatedWeeks }}
			</p>
		</div>

		<!-- 按鈕 -->
		<div class="flex justify-between">
			<button
				class="btn btn-goast"
				:disabled="currentStep === 0"
				@click="currentStep--"
			>
				上一步
			</button>
			<button class="btn btn-primary" @click="handleNext">
				{{ currentStep === totalSteps - 1 ? '儲存' : '下一步' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loadingBar = useLoadingBar();

const currentStep = ref(0);
const totalSteps = 4;

const form = ref({
	gender: '',
	birth: '',
	height: null,
	weight: null,
	fitnessGoal: '',
	targetWeight: null,
	durationWeeks: null,
	exercise: '',
	workStyle: '',
	activityLevel: '',
});
onMounted(() => {
	if (authStore.userProfile) {
		form.value = {
			gender: authStore.userProfile.gender || '',
			birth: authStore.userProfile.birth || null,
			height: authStore.userProfile.height || null,
			weight: authStore.userProfile.init_weight || null,
			fitnessGoal: authStore.userProfile.fitness_goal || '',
			targetWeight: authStore.userProfile.target_weight || null,
			durationWeeks: null,
			exercise: '',
			workStyle: '',
			activityLevel: '',
		};
	}
});

const activityLevel = (exercise: string, workStyle: string): string => {
	if (!exercise || !workStyle) return ''; // 沒填完不給結果

	if (exercise === 'usually' && workStyle === 'active') {
		return 'very_active';
	}
	if (exercise === 'usually' || workStyle === 'active') {
		return 'active';
	}
	if (exercise === 'often') {
		return 'moderate';
	}
	if (
		(exercise === 'occasionally' && workStyle !== 'sedentary') ||
		(exercise === 'rarely' && workStyle === 'light')
	) {
		return 'light';
	}
	return 'sedentary';
};

watch([() => form.value.exercise, () => form.value.workStyle], () => {
	const level = activityLevel(form.value.exercise, form.value.workStyle);
	form.value.activityLevel = level;
});
const showActivityLevel = computed(() => {
	if (!form.value.exercise || !form.value.workStyle) return '';

	const map: Record<string, string> = {
		sedentary: '久坐',
		light: '輕度活動',
		moderate: '中度活動',
		active: '高度活動',
		very_active: '非常活躍',
	};

	const level = activityLevel(form.value.exercise, form.value.workStyle);
	return map[level] || '未設定';
});

const getAgeFromBirth = (birth: string): number => {
	const birthDate = new Date(birth);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
};

//計算卡路里目標
const calcBaseValues = computed(() => {
	if (
		!form.value.gender ||
		!form.value.birth ||
		!form.value.height ||
		!form.value.weight ||
		!form.value.activityLevel
	) {
		return null;
	}
	const age = getAgeFromBirth(form.value.birth);
	const isMale = form.value.gender === 'male';

	const bmr = isMale
		? 13.7 * form.value.weight + 5 * form.value.height - 6.8 * age + 66
		: 9.6 * form.value.weight + 1.8 * form.value.height - 4.7 * age + 655;

	const activityFactors: Record<string, number> = {
		sedentary: 1.2,
		light: 1.375,
		moderate: 1.55,
		active: 1.725,
		very_active: 1.9,
	};

	const tdee = bmr * (activityFactors[form.value.activityLevel] || 1.2);

	return { bmr, tdee };
});

const calorieTarget = computed(() => {
	const base = calcBaseValues.value;
	if (
		!base ||
		!form.value.fitnessGoal ||
		!form.value.targetWeight ||
		!form.value.weight ||
		!form.value.durationWeeks
	) {
		return null;
	}

	const { tdee, bmr } = base;
	const weightDiff = form.value.weight - form.value.targetWeight;
	const totalDiffKcal = Math.abs(weightDiff) * 7700;
	const days = form.value.durationWeeks * 7;
	const dailyDiff = totalDiffKcal / days;

	let result = tdee;

	if (form.value.fitnessGoal === 'cutting') {
		result = tdee - dailyDiff;
	} else if (form.value.fitnessGoal === 'bulking') {
		result = tdee + dailyDiff;
	}

	const minAllowed = tdee * 0.8;
	return Math.round(Math.max(result, minAllowed));
});

const calorieRange = computed(() => {
	const base = calcBaseValues.value;
	if (!base || !form.value.fitnessGoal) return null;

	const { tdee } = base;

	if (form.value.fitnessGoal === 'cutting') {
		return {
			min: Math.round(tdee * 0.8),
			max: Math.round(tdee * 0.9),
		};
	} else if (form.value.fitnessGoal === 'bulking') {
		return {
			min: Math.round(tdee * 1.1),
			max: Math.round(tdee * 1.2),
		};
	} else {
		const fixed = Math.round(tdee);
		return { min: fixed, max: fixed };
	}
});
const calorieRangeText = computed(() => {
	if (!calorieRange.value || !macroInput.value.calorie)
		return '尚未提供足夠資訊';

	const { min, max } = calorieRange.value;
	const calorie = macroInput.value.calorie;

	if (calorie < min) {
		return `熱量過低，\n建議區間為 ${min}~${max} kcal／天`;
	}
	if (calorie > max) {
		return `熱量過高，\n建議區間為 ${min}~${max} kcal／天`;
	}

	return `建議熱量區間：${min}~${max} kcal／天`;
});

const isCalorieEdited = ref(false);
watchEffect(() => {
	if (calorieTarget.value && !isCalorieEdited.value) {
		macroInput.value.calorie = calorieTarget.value;
	}
});

const estimatedWeeks = computed(() => {
	const base = calcBaseValues.value;
	const goal = form.value.fitnessGoal;
	const calorie = macroInput.value.calorie;
	const currentWeight = form.value.weight;
	const targetWeight = form.value.targetWeight;

	if (!base || !goal || !calorie || !currentWeight || !targetWeight) {
		return null;
	}

	const tdee = base.tdee;
	const weightDiff = targetWeight - currentWeight;
	const diffKcal = Math.abs(weightDiff) * 7700;

	let dailyDiff = 0;
	if (goal === 'cutting' && calorie < tdee) {
		dailyDiff = tdee - calorie;
	} else if (goal === 'bulking' && calorie > tdee) {
		dailyDiff = calorie - tdee;
	} else {
		return '熱量設定與目標方向不符，無法達成目標';
	}

	const estimatedDays = diffKcal / dailyDiff;
	const weeks = estimatedDays / 7;

	if (weeks > 200) return '設定太保守，建議重新評估';

	return `依此進度，您將於 ${Math.round(weeks)} 週後達成目標`;
});

//營養素
const macroInput = ref({
	calorie: calorieTarget.value || 1800,
	ratio: {
		protein: 30,
		fat: 25,
		carb: 45,
	},
});
const macroGrams = computed(() => {
	const cal = macroInput.value.calorie;
	return {
		protein: Math.round(((macroInput.value.ratio.protein / 100) * cal) / 4),
		fat: Math.round(((macroInput.value.ratio.fat / 100) * cal) / 9),
		carb: Math.round(((macroInput.value.ratio.carb / 100) * cal) / 4),
	};
});
const suggestedRatios: Record<
	string,
	{ protein: number; fat: number; carb: number }
> = {
	cutting: { protein: 30, fat: 25, carb: 45 },
	maintaining: { protein: 25, fat: 30, carb: 45 },
	bulking: { protein: 25, fat: 20, carb: 55 },
};
watch(
	() => form.value.fitnessGoal,
	(goal) => {
		if (goal && suggestedRatios[goal]) {
			macroInput.value.ratio = { ...suggestedRatios[goal] };
		}
	}
);

const isMacrosEdited = ref(false);
const resetMacros = () => {
	const goal = form.value.fitnessGoal;
	if (goal && suggestedRatios[goal]) {
		macroInput.value.ratio = { ...suggestedRatios[goal] };
		isMacrosEdited.value = false;
	}
};

const totalRatio = computed(() => {
	const ratio = macroInput.value.ratio;
	return ratio.protein + ratio.fat + ratio.carb;
});
const isRatioInvalid = computed(() => totalRatio.value !== 100);

//下一步按鈕
const requiredFieldsPerStep: Record<number, (keyof typeof form.value)[]> = {
	0: ['gender', 'birth', 'height', 'weight'],
	1: ['fitnessGoal', 'targetWeight', 'durationWeeks'],
	2: ['exercise', 'workStyle'],
};
const isStepValid = (step: number): boolean => {
	const requiredFields = requiredFieldsPerStep[step];
	if (!requiredFields) return true;
	return requiredFields.every((field) => {
		const value = form.value[field];
		return value !== null && value !== '' && value !== undefined;
	});
};

const handleNext = async () => {
	if (currentStep.value < totalSteps - 1 && !isStepValid(currentStep.value)) {
		toast.show('請完成所有欄位再繼續喔！');
		return;
	}
	if (currentStep.value < totalSteps - 1) {
		currentStep.value++;
	} else {
		if (isRatioInvalid.value) {
			toast.show('營養素比例總和須為100%', 'error');
		} else {
			submitForm();
		}
	}
};

const submitForm = async () => {
	loadingBar.start();
	const payload = {
		birth: form.value.birth,
		gender: form.value.gender,
		height: form.value.height,
		fitness_goal: form.value.fitnessGoal,
		activity_level: form.value.activityLevel,
		target_weight: form.value.targetWeight,
		calorie_target: calorieTarget.value,
		protain_target: macroGrams.value.protein,
		fat_target: macroGrams.value.fat,
		carb_target: macroGrams.value.carb,
	};

	try {
		const result = await authStore.updateUserProfile(payload);

		if (result?.success) {
			loadingBar.end();
			router.push('/auth/profile');
			toast.show('已儲存熱量及營養素目標!', 'success');
		} else {
			loadingBar.error();
			toast.show('發生錯誤，請稍後再試', 'error');
		}
	} catch (error) {
		loadingBar.error();
		toast.show('發生錯誤，請稍後再試', 'error');
	}
};
</script>
