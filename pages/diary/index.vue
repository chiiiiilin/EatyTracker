<template>
	<div>
		<UiCalendar v-model:selectedDate="selectedDate" />

		<main class="mt-2">
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
				<div
					v-show="modalVisible"
					class="fixed inset-0 bg-black/60 z-50 flex justify-center items-center px-4"
					@click.self="closeDetail"
				>
					<div
						class="bg-base-100 rounded-lg max-w-sm w-full h-auto transition-all duration-300 overflow-hidden"
					>
						<div class="relative">
							<img
								v-if="selectedItem?.photo_url"
								:src="selectedItem?.photo_url"
								class="w-full h-65 object-cover"
							/>
							<div v-else class="w-full h-6"></div>
							<div
								class="w-full h-auto absolute top-0 flex justify-between"
								:class="
									selectedItem?.photo_url
										? 'bg-gradient-to-b from-black/30 to-transparent text-white'
										: 'text-base-content'
								"
							>
								<X
									:size="40"
									class="p-3 cursor-pointer"
									@click="closeDetail"
								/>
								<div class="flex">
									<Trash2
										:size="40"
										class="p-3 cursor-pointer"
										@click="deleteMeal(selectedItem.id)"
									/>
									<Pencil
										:size="40"
										class="p-3 cursor-pointer"
										@click="editMeal(selectedItem.id)"
									/>
								</div>
							</div>
						</div>
						<div class="px-3 py-6">
							<div class="flex w-full justify-between">
								<h3 class="text-lg font-bold mb-2">
									{{ selectedItem?.food?.name }}
								</h3>
								<p class="text-lg opacity-60">
									{{ selectedItem?.quantity }}g
								</p>
							</div>
							<div class="h-[150px] w-full">
								<UiNutritionChart
									v-if="computedNutrition"
									class="w-full"
									:protein="computedNutrition.protein"
									:fat="computedNutrition.fat"
									:carbs="computedNutrition.carbs"
									:fiber="computedNutrition.fiber"
									:sodium="computedNutrition.sodium"
									:sugar="computedNutrition.sugar"
									:cholesterol="computedNutrition.cholesterol"
									:calories="computedNutrition.calories"
								/>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</main>
	</div>
</template>

<script setup lang="ts">
import { Trash2, X, Pencil } from 'lucide-vue-next';
import type { Food } from '@/types/food';
const { $supabase }: any = useNuxtApp();
const foodStore = useFoodStore();
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
				console.warn('❌ Storage 刪除失敗:', storageError);
			} else {
				console.log('✅ Storage 刪除成功');
			}
		}

		foodStore.fetchMealLogs(selectedDate.value);
		modalVisible.value = false;
		setTimeout(() => (selectedItem.value = null), 300);
		toast.show('已成功刪除', 'success');
	} catch (err) {
		console.error('❌ 刪除時發生錯誤:', err);
		toast.show('刪除失敗', 'error');
	}
};

const editMeal = (id: string) => {
	router.push(`/diary/editMealLog/${id}`);
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
