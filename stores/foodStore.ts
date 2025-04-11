import { defineStore } from 'pinia';

export const useFoodStore = defineStore('foodStore', () => {
	const { $supabase }: any = useNuxtApp();
	const foods = ref<Record<string, any>>([]);

	const fetchFoods = async () => {
		if (foods.value.length === 0) {
			const { data, error } = await $supabase
				.from('foods')
				.select('*')
				.range(0, 4999);

			if (error) {
				console.error('無法獲取食物清單');
			}
			if (data) {
				foods.value = data;
			}
		}
	};

	return {
		foods,
		fetchFoods,
	};
});
