<template>
	<div class="top-5 relative">
		<UiBackButton />
		<div class="flex justify-end items-center gap-2">
			<h1 class="text-lg text-center">編輯飲食紀錄</h1>
			<input
				type="date"
				class="input input-ghost w-40 input-md"
				v-model="selectedDate"
			/>
		</div>

		<div class="mt-10 mx-8">
			<div class="flex justify-between">
				<div
					v-for="type in mealTypes"
					:key="type.value"
					class="py-2 px-4 rounded-md cursor-pointer bg-base-300 text-base-content"
					:class="
						selectedMealType === type.value
							? 'opacity-100 shadow-sm'
							: 'opacity-20'
					"
					@click="selectedMealType = type.value"
				>
					<component :is="type.icon" :size="28" />
					<span class="text-xs">{{ type.label }}</span>
				</div>
			</div>

			<form @submit.prevent="submit">
				<div
					v-for="(item, index) in form"
					:key="index"
					class="border-b pt-2 pb-4 relative"
				>
					<div class="mt-5 flex justify-between items-end">
						<UiImageUploader
							path="meal_images"
							v-model:file="item.selectedFile"
							v-model:url="item.imageUrl"
						/>

						<div class="w-full pl-4">
							<fieldset class="fieldset">
								<legend class="fieldset-legend">
									食物名稱
								</legend>
								<div class="dropdown w-full">
									<div
										class="input input-md"
										@click="item.open = true"
									>
										<input
											v-model="item.searchText"
											type="text"
											placeholder="搜尋食物"
											@input="filterFoods(item)"
											@focus="item.open = true"
											@change="
												item.selectedFood &&
													(item.nutrition =
														calculateNutrition(
															item.selectedFood,
															item.quantity
														))
											"
											@keydown.enter.prevent="
												autoSelectFirst(item)
											"
											@blur="autoSelectFirst(item)"
										/>
									</div>
									<ul
										v-if="item.open && filteredFoods.length"
										class="dropdown-content py-2 shadow bg-base-100 rounded-box max-h-48 overflow-y-auto w-full"
									>
										<li
											v-for="food in filteredFoods"
											:key="food.id"
											class="w-full"
										>
											<div
												@mousedown.prevent="
													selectFood(item, food)
												"
												class="block truncate w-full p-2 cursor-pointer hover:bg-primary-content"
											>
												{{ food.name }}
											</div>
										</li>
									</ul>
								</div>

								<legend class="fieldset-legend">
									食用份量 (公克)
								</legend>
								<input
									v-model.number="item.quantity"
									type="number"
									class="input input-md"
									placeholder="填入克數"
									@input="
										item.selectedFood &&
											(item.nutrition =
												calculateNutrition(
													item.selectedFood,
													item.quantity
												))
									"
								/>
							</fieldset>
						</div>
					</div>

					<div
						class="h-24 w-full mt-3"
						v-show="
							item.quantity &&
							item.quantity !== 0 &&
							item.selectedFood
						"
					>
						<DiaryNutritionChart
							class="w-full"
							:protein="item.nutrition.protein"
							:fat="item.nutrition.fat"
							:carbs="item.nutrition.carbs"
							:fiber="item.nutrition.fiber"
							:sodium="item.nutrition.sodium"
							:sugar="item.nutrition.sugar"
							:cholesterol="item.nutrition.cholesterol"
							:calories="item.nutrition.calories"
							:showLabels="['蛋白質', '脂肪', '碳水']"
						/>
					</div>
				</div>

				<button class="btn btn-primary w-full my-5">儲存</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import type { Food } from '@/types/food';
import {
	Sandwich,
	Beef,
	CookingPot,
	CakeSlice,
	CupSoda,
} from 'lucide-vue-next';

const { $supabase }: any = useNuxtApp();
const router = useRouter();
const route = useRoute();
const foodStore = useFoodStore();
const authStore = useAuthStore();
const loadingBar = useLoadingBar();
const toast = useToast();

const mealTypes = [
	{ icon: Sandwich, value: 'breakfast', label: '早餐' },
	{ icon: Beef, value: 'lunch', label: '午餐' },
	{ icon: CookingPot, value: 'dinner', label: '晚餐' },
	{ icon: CakeSlice, value: 'snack', label: '點心' },
	{ icon: CupSoda, value: 'drink', label: '飲品' },
];

const selectedDate = ref('');
const selectedMealType = ref('');
const filteredFoods = ref<Food[]>([]);

const form = ref([
	{
		searchText: '',
		selectedFood: null as Food | null,
		selectedFile: null as File | null,
		imageUrl: null as string | null,
		quantity: 0,
		photo_path: '',
		open: false,
		nutrition: {
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0,
			fiber: 0,
			sodium: 0,
			sugar: 0,
			cholesterol: 0,
		},
	},
]);

const fetchData = async () => {
	const id = route.params.id;
	if (!id || typeof id !== 'string') {
		toast.show('無效的 ID', 'error');
		return router.push('/diary');
	}

	const { data, error } = await $supabase
		.from('meal_logs')
		.select('*')
		.eq('id', id)
		.single();

	if (error || !data) {
		toast.show('找不到資料', 'error');
		return router.push('/diary');
	}

	selectedDate.value = data.date;
	selectedMealType.value = data.meal_type;

	await foodStore.fetchFoods();
	const food = foodStore.foods.find((f: Food) => f.id === data.source_id);

	form.value[0] = {
		searchText: food?.name || '',
		selectedFood: food || null,
		selectedFile: null,
		imageUrl: data.photo_url,
		quantity: data.quantity,
		photo_path: data.photo_path,
		open: false,
		nutrition: food
			? calculateNutrition(food, data.quantity)
			: {
					calories: 0,
					protein: 0,
					carbs: 0,
					fat: 0,
					fiber: 0,
					sodium: 0,
					sugar: 0,
					cholesterol: 0,
			  },
	};
};

onMounted(fetchData);

const filterFoods = (item: any) => {
	if (!item?.searchText) return;
	const keyword = item.searchText.trim();
	filteredFoods.value = foodStore.foods.filter((food: Food) => {
		return food.name?.includes(keyword) || food.alias?.includes(keyword);
	});
};

const selectFood = (item: any, food: Food) => {
	item.selectedFood = food;
	item.searchText = food.name;
	if (item.selectedFood) {
		item.nutrition = calculateNutrition(food, item.quantity);
	}
	item.open = false;
};

const autoSelectFirst = (item: any) => {
	if (!item.selectedFood && filteredFoods.value.length > 0) {
		selectFood(item, filteredFoods.value[0]);
	}
	item.open = false;
};

const calculateNutrition = (food: Food, quantity: number) => {
	const ratio = quantity / 100;
	return {
		calories: +(food.calories * ratio).toFixed(1),
		protein: +(food.protein * ratio).toFixed(1),
		carbs: +(food.carbs * ratio).toFixed(1),
		fat: +(food.fat * ratio).toFixed(1),
		fiber: +(food.fiber * ratio).toFixed(1),
		sodium: +(food.sodium * ratio).toFixed(1),
		sugar: +(food.sugar * ratio).toFixed(1),
		cholesterol: +(food.cholesterol * ratio).toFixed(1),
	};
};

const submit = async () => {
	if (!selectedMealType.value) {
		return toast.show('請選擇餐別', 'error');
	}

	if (!selectedDate.value) {
		return toast.show('請選擇日期', 'error');
	}

	const item = form.value[0];
	if (!item.selectedFood || !item.quantity || item.quantity <= 0) {
		return toast.show('請選擇食物並輸入正確份量', 'error');
	}

	loadingBar.start();
	try {
		const id = route.params.id;
		const item = form.value[0];

		let photoUrl = item.imageUrl;
		let photoPath = item.photo_path;

		if (item.selectedFile) {
			if (item.photo_path) {
				await $supabase.storage
					.from('meal-logs')
					.remove([item.photo_path]);
			}

			const filePath = `${authStore.user!.id}/${Date.now()}_${
				item.selectedFile.name
			}`;
			const { error: uploadError } = await $supabase.storage
				.from('meal-logs')
				.upload(filePath, item.selectedFile);
			if (uploadError) throw uploadError;
			const { publicUrl } = $supabase.storage
				.from('meal-logs')
				.getPublicUrl(filePath).data;
			photoUrl = publicUrl;
			photoPath = filePath;
		}

		// 更新資料表
		const { error } = await $supabase
			.from('meal_logs')
			.update({
				meal_type: selectedMealType.value,
				date: selectedDate.value,
				quantity: item.quantity,
				source_type: 'food',
				source_id: item.selectedFood?.id,
				photo_url: photoUrl,
				photo_path: photoPath,
			})
			.eq('id', id);

		if (error) throw error;
		router.push('/diary');
	} catch (err) {
		console.error('更新失敗:', err);
		toast.show('更新失敗，請稍後再試', 'error');
	} finally {
		loadingBar.end();
	}
};
</script>
