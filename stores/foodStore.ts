import { defineStore } from 'pinia';
import type { Food } from '@/types/food';
import type { MealLog } from '@/types/mealLog';

export const useFoodStore = defineStore('foodStore', () => {
	const { $supabase }: any = useNuxtApp();
	const authStore = useAuthStore();

	const foods = ref<Food[]>([]);
	const mealLogs = ref<MealLog[]>([]);

	const fetchFoods = async () => {
		if (foods.value.length === 0) {
			const { data, error } = await $supabase
				.from('foods')
				.select('*')
				.range(0, 4999);

			if (error) {
				console.error('無法獲取食物清單', error);
			}
			if (data) {
				foods.value = data;
			}
		}
	};
	const fetchMealLogs = async (date: Date) => {
		if (!authStore.user?.id) return;

		const formattedDate = date.toLocaleDateString('sv-SE');

		const { data: logs, error: logError } = await $supabase
			.from('meal_logs')
			.select('*')
			.eq('user_id', authStore.user?.id)
			.eq('date', formattedDate);

		if (logError) {
			console.error('無法取得飲食紀錄:', logError);
			return;
		}

		if (!logs || logs.length === 0) {
			mealLogs.value = [];
			return;
		}

		const foodLogs = logs.filter(
			(log: MealLog) => log.source_type === 'food'
		);
		const foodIds = foodLogs.map((log: MealLog) => log.source_id);

		let foodsMap: Record<string, Food> = {};

		if (foodIds.length > 0) {
			const { data: foods, error: foodError } = await $supabase
				.from('foods')
				.select('*')
				.in('id', foodIds);

			if (foodError) {
				console.error('無法取得 foods 資料:', foodError);
			}

			foodsMap = Object.fromEntries(
				foods.map((food: Food) => [food.id, food])
			);
		}

		mealLogs.value = logs.map((log: MealLog) => {
			if (log.source_type === 'food') {
				return {
					...log,
					food: foodsMap[log.source_id] || null,
				};
			}
			return log;
		});
	};

	return {
		foods,
		mealLogs,
		fetchFoods,
		fetchMealLogs,
	};
});
