<template>
	<div
		class="w-full max-w-md fixed left-1/2 translate-x-[-50%] inset-0 bg-black/60 z-50 flex justify-center items-center px-4"
		@click.self="$emit('close')"
	>
		<div
			class="bg-base-100 rounded-lg max-w-md w-full p-6 overflow-y-auto max-h-[80vh]"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold">今日營養素總結</h2>
				<X class="cursor-pointer" @click="$emit('close')" />
			</div>

			<div v-if="goalValues && computedNutrition">
				<template v-for="(value, key) in computedNutrition" :key="key">
					<div v-if="goalValues[key] !== undefined" class="mb-3">
						<div class="flex justify-between items-center mb-1">
							<span>{{ labelMap[key] }}</span>
							<span
								:class="{
									'text-success': isEncourage(
										key,
										value,
										goalValues[key]
									),
									'text-error': isLimit(
										key,
										value,
										goalValues[key]
									),
								}"
							>
								{{ value }} / {{ goalValues[key] }}
								<span class="text-sm">{{ unitMap[key] }}</span>
							</span>
						</div>
						<progress
							class="progress w-full"
							:max="goalValues[key]"
							:value="value"
							:class="{ 'opacity-30': value === 0 }"
						></progress>
					</div>
				</template>
			</div>

			<div v-else class="text-center text-sm opacity-60">
				尚無目標或攝取資料
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import type { userGoalLog } from '~/types/userGoalLog';

type NutrientKey =
	| 'calories'
	| 'protein'
	| 'fat'
	| 'carbs'
	| 'fiber'
	| 'sodium'
	| 'sugar'
	| 'cholesterol';

const props = defineProps<{
	selectedDate: Date;
	totalCalories: number;
	remainingCalories: number;
	goal: userGoalLog | null;
}>();

const foodStore = useFoodStore();

//中文標籤對應
const labelMap: Record<NutrientKey, string> = {
	calories: '熱量',
	protein: '蛋白質',
	fat: '脂肪',
	carbs: '碳水化合物',
	fiber: '膳食纖維',
	sodium: '鈉',
	sugar: '糖',
	cholesterol: '膽固醇',
};

//單位對應
const unitMap: Record<NutrientKey, 'g' | 'mg' | 'kcal'> = {
	calories: 'kcal',
	protein: 'g',
	fat: 'g',
	carbs: 'g',
	fiber: 'g',
	sodium: 'mg',
	sugar: 'g',
	cholesterol: 'mg',
};

//類型分類（鼓勵型、限制型、目標型）
const nutrientTypeMap = computed<
	Record<NutrientKey, 'encourage' | 'target' | 'limit'>
>(() => ({
	calories: props.goal?.fitness_goal === 'cutting' ? 'limit' : 'target',
	protein: 'encourage',
	fat: 'target',
	carbs: 'target',
	fiber: 'encourage',
	sodium: 'limit',
	sugar: 'limit',
	cholesterol: 'limit',
}));

//fallback 預設建議攝取值
const fallbackGoalValues = computed<Record<NutrientKey, number>>(() => {
	const cals = props.goal?.calorie_target ?? 2000;
	return {
		calories: cals,
		protein: +((cals * 0.2) / 4).toFixed(1),
		fat: +((cals * 0.3) / 9).toFixed(1),
		carbs: +((cals * 0.5) / 4).toFixed(1),
		fiber: 25,
		sodium: 2000,
		sugar: 30,
		cholesterol: 300,
	};
});

//最終 goal 值合併 fallback 與使用者設定
const goalValues = computed<Record<NutrientKey, number>>(() => {
	const base = fallbackGoalValues.value;
	if (!props.goal) return base;

	return {
		...base,
		calories: props.goal.calorie_target,
		protein: props.goal.protein_target,
		fat: props.goal.fat_target,
		carbs: props.goal.carb_target,
	};
});

//計算攝取總量
const computedNutrition = computed<Record<NutrientKey, number> | null>(() => {
	const logs = foodStore.mealLogs;
	if (!logs?.length) return fallbackEmpty();

	const totals: Record<NutrientKey, number> = fallbackEmpty();

	for (const item of logs) {
		if (!item.food || !item.quantity) continue;
		const ratio = item.quantity / 100;
		totals.calories += item.food.calories * ratio;
		totals.protein += item.food.protein * ratio;
		totals.fat += item.food.fat * ratio;
		totals.carbs += item.food.carbs * ratio;
		totals.fiber += item.food.fiber * ratio;
		totals.sodium += item.food.sodium * ratio;
		totals.sugar += item.food.sugar * ratio;
		totals.cholesterol += item.food.cholesterol * ratio;
	}

	for (const key in totals) {
		totals[key as NutrientKey] = +totals[key as NutrientKey].toFixed(1);
	}
	return totals;
});

//初始值為 0（無攝取資料時仍顯示空條）
function fallbackEmpty(): Record<NutrientKey, number> {
	return {
		calories: 0,
		protein: 0,
		fat: 0,
		carbs: 0,
		fiber: 0,
		sodium: 0,
		sugar: 0,
		cholesterol: 0,
	};
}

//綠色條件（鼓勵型 or 接近目標值）
const isEncourage = (key: NutrientKey, actual: number, target?: number) => {
	const type = nutrientTypeMap.value[key];
	if (type === 'encourage') return actual >= (target ?? 0);
	if (type === 'target')
		return actual >= (target ?? 0) * 0.9 && actual <= (target ?? 0) * 1.1;
	return false;
};

//紅色條件（限制型超過上限）
const isLimit = (key: NutrientKey, actual: number, target?: number) => {
	const type = nutrientTypeMap.value[key];
	if (key === 'calories' && type === 'limit')
		return actual > (target ?? 0) + 50;
	if (type === 'limit') return actual > (target ?? Infinity);
	return false;
};
</script>

<style scoped>
.progress {
	height: 0.75rem;
}
</style>
