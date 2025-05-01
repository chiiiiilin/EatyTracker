<template>
	<div class="relative overflow-x-hidden">
		<UiCalendar v-model:selectedDate="selectedDate" />

		<main class="mt-2 mb-[30px]">
			<div
				v-for="item in sortedMealLogs"
				:key="item.id"
				class="w-full py-2 px-5 cursor-pointer"
				@click="openDetail(item)"
			>
				<div v-if="item.food">
					<div class="flex justify-between">
						<div>
							<div class="flex items-baseline">
								<p class="text-lg mr-2">{{ item.food.name }}</p>
								<span>{{ item.quantity }}g</span>
							</div>
							<div
								class="flex text-base-content opacity-50 text-md"
							>
								<span
									v-for="[key, value] in Object.entries(
										calcNutrition(item.food, item.quantity)
									).filter(([key]) => key !== 'calories')"
									:key="key"
									class="mr-3"
								>
									{{ key }}: {{ value }}g
								</span>
							</div>
						</div>
						<div class="flex flex-col items-end justify-between">
							<p>
								{{
									calcNutrition(item.food, item.quantity)
										.calories
								}}
								kcal
							</p>
							<div
								:class="[
									'badge badge-soft',
									mealTypeStyle[item.meal_type],
								]"
							>
								{{
									mealTypeLabels[item.meal_type] ||
									item.meal_type
								}}
							</div>
						</div>
					</div>
				</div>
				<input
					type="checkbox"
					id="meal-detail-modal"
					class="modal-toggle"
				/>
			</div>
			<transition name="fade" @after-leave="afterLeave">
				<DiaryMealDetailModal
					v-if="modalVisible"
					:visible="modalVisible"
					:item="selectedItem"
					:nutrition="computedNutrition"
					@close="closeDetail"
					@delete="deleteMeal"
					@edit="editMeal"
				/>
			</transition>
			<transition name="fade" @after-leave="afterLeave">
				<DiarySummaryModal
					v-if="summaryVisible"
					:selectedDate="selectedDate"
					:totalCalories="todayTotalCalories"
					:remainingCalories="remainingCalories"
					:goal="selectedGoal"
					@close="summaryVisible = false"
				/>
			</transition>
		</main>
		<div class="flex justify-center">
			<div
				class="bg-base-300 rounded-md py-2 px-3 shadow-md w-fit mx-auto cursor-pointer fixed bottom-[100px] z-30"
				@click="goToSummary"
			>
				<template v-if="selectedGoal">
					<h4 class="text-base-content">
						剩餘：
						<span
							:class="[
								'font-semibold',
								remainingCalories < -50 &&
								selectedGoal.fitness_goal === 'cutting'
									? 'text-error'
									: 'text-base-content',
							]"
						>
							{{ selectedGoal.calorie_target }} -
							{{ todayTotalCalories }} =
							{{ remainingCalories }} kcal
						</span>
					</h4>
				</template>
				<h4 v-else>
					總計:
					<span class="font-semibold"
						>{{ todayTotalCalories }} kcal</span
					>
				</h4>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Food } from '@/types/food';
const { $supabase }: any = useNuxtApp();
const foodStore = useFoodStore();
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const selectedDate = ref(new Date());

watch(
	selectedDate,
	(newDate) => {
		foodStore.fetchMealLogs(newDate);
	},
	{ immediate: true }
);

const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'drink'];

const sortedMealLogs = computed(() => {
	return [...foodStore.mealLogs].sort((a, b) => {
		return (
			mealTypeOrder.indexOf(a.meal_type) -
			mealTypeOrder.indexOf(b.meal_type)
		);
	});
});

const calcNutrition = (food?: Food, quantity?: number) => {
	if (!food || !quantity) return { calories: 0, p: 0, f: 0, c: 0 };

	const ratio = quantity / 100;
	return {
		calories: +(food.calories * ratio).toFixed(1),
		p: +(food.protein * ratio).toFixed(1),
		f: +(food.fat * ratio).toFixed(1),
		c: +(food.carbs * ratio).toFixed(1),
	};
};

const calcFullNutrition = (food: Food, quantity: number) => {
	const ratio = quantity / 100;
	return {
		protein: +(food.protein * ratio).toFixed(1),
		fat: +(food.fat * ratio).toFixed(1),
		carbs: +(food.carbs * ratio).toFixed(1),
		fiber: +(food.fiber * ratio).toFixed(1),
		sodium: +(food.sodium * ratio).toFixed(1),
		sugar: +(food.sugar * ratio).toFixed(1),
		cholesterol: +(food.cholesterol * ratio).toFixed(1),
		calories: +(food.calories * ratio).toFixed(1),
	};
};

const computedNutrition = computed(() => {
	if (!selectedItem.value?.food || !selectedItem.value?.quantity) return null;
	return calcFullNutrition(
		selectedItem.value.food,
		selectedItem.value.quantity
	);
});

const mealTypeLabels: Record<string, string> = {
	breakfast: '早餐',
	lunch: '午餐',
	dinner: '晚餐',
	snack: '點心',
	drink: '飲品',
};
const mealTypeStyle: Record<string, string> = {
	breakfast: 'badge-primary',
	lunch: 'badge-primary',
	dinner: 'badge-primary',
	snack: 'badge-secondary',
	drink: 'badge-secondary',
};

//點開顯示modal
const selectedItem = ref<any>(null);
const modalVisible = ref(false);
const openDetail = (item: any) => {
	selectedItem.value = item;
	modalVisible.value = true;
};

const closeDetail = () => {
	modalVisible.value = false;
};

const afterLeave = () => {
	selectedItem.value = null;
};

const deleteMeal = async (id: string) => {
	try {
		const target = foodStore.mealLogs.find((item) => item.id === id);
		if (!target) return;

		const { error: deleteError } = await $supabase
			.from('meal_logs')
			.delete()
			.eq('id', id);

		if (deleteError) throw deleteError;

		if (target.photo_path) {
			const { error: storageError } = await $supabase.storage
				.from('meal-logs')
				.remove([target.photo_path]);

			if (storageError) {
				console.warn('Storage 刪除失敗:', storageError);
			}
		}

		foodStore.fetchMealLogs(selectedDate.value);
		modalVisible.value = false;
		setTimeout(() => (selectedItem.value = null), 300);
	} catch (err) {
		console.error('刪除時發生錯誤:', err);
		toast.show('刪除失敗', 'error');
	}
};

const editMeal = (id: string) => {
	router.push(`/diary/editMealLog/${id}`);
};

//目標營養素檢視面板
onMounted(() => {
	authStore.fetchUserGoalLog();
});

const selectedGoal = computed(() => {
	const logs = authStore.userGoalLog;
	if (!logs?.length || !selectedDate.value) return null;

	const selectedDateOnly = new Date(selectedDate.value);
	selectedDateOnly.setHours(0, 0, 0, 0);

	const validGoals = logs.filter((goal) => {
		const goalDate = new Date(goal.start_date);
		goalDate.setHours(0, 0, 0, 0);
		return goalDate <= selectedDateOnly;
	});

	if (!validGoals.length) return null;

	return validGoals.reduce((latest, current) => {
		const latestDate = new Date(latest.start_date);
		const currentDate = new Date(current.start_date);
		return currentDate > latestDate ? current : latest;
	});
});

const todayTotalCalories = computed(() => {
	const sum = foodStore.mealLogs.reduce((total, item) => {
		if (!item.food || !item.quantity) return total;
		const ratio = item.quantity / 100;
		return total + item.food.calories * ratio;
	}, 0);
	return Math.round(sum);
});

const remainingCalories = computed(() => {
	if (!selectedGoal.value) return 0;
	return selectedGoal.value.calorie_target - todayTotalCalories.value;
});

const summaryVisible = ref(false);
const goToSummary = () => {
	summaryVisible.value = true;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
