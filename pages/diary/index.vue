<template>
	<div>
		<UiCalendar v-model:selectedDate="selectedDate" />

		<main class="mt-2">
			<div
				v-for="item in sortedMealLogs"
				:key="item.id"
				class="w-full py-2 px-5"
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
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import type { Food } from '@/types/food';
const foodStore = useFoodStore();

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

const calcNutrition = (food: Food, quantity: number) => {
	const ratio = quantity / 100;
	return {
		calories: (food.calories * ratio).toFixed(1),
		p: (food.protein * ratio).toFixed(1),
		f: (food.fat * ratio).toFixed(1),
		c: (food.carbs * ratio).toFixed(1),
	};
};

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
</script>

<style scoped></style>
