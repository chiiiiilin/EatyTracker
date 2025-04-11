<template>
	<div class="top-5 relative">
		<UiBackButton />
		<div class="flex justify-end items-center gap-2">
			<h1 class="text-lg text-center">新增飲食紀錄</h1>
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
					class="py-2 px-4 rounded-md cursor-pointer bg-base-300 text-base-content"
					:class="
						selectedMealType === type.value
							? 'opacity-100 shadow-sm'
							: 'opacity-20 '
					"
					@click="selectedMealType = type.value"
				>
					<component :is="type.icon" :size="28" />
					<span class="text-xs">{{ type.label }}</span>
				</div>
			</div>

			<form action="">
				<div
					v-for="(item, index) in form"
					:key="index"
					class="border-b pt-2 pb-4 relative"
				>
					<button
						v-if="index !== 0"
						class="absolute right-2 top-6 p-2 text-base-content opacity-50 hover:opacity-100"
						@click.prevent="removeForm(index)"
					>
						<Delete :size="18" />
					</button>
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
										@click="open = true"
									>
										<input
											v-model="item.searchText"
											type="text"
											placeholder="搜尋食物"
											@input="filterFoods(item)"
											@focus="item.open = true"
											@change="calculatedNutrition(item)"
											@keydown.enter.prevent="
												autoSelectFirst(item)
											"
											@blur="autoSelectFirst(item)"
										/>
									</div>
									<ul
										v-if="open && filteredFoods.length"
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
									@input="calculatedNutrition(item)"
								/>
							</fieldset>
						</div>
					</div>
					<div
						class="h-24 w-full mt-3"
						v-show="
							item.quantity && item.quantity !== 0 && selectFood
						"
					>
						<UiNutritionChart
							class="w-full"
							:protein="item.nutrition.protein"
							:fat="item.nutrition.fat"
							:carbs="item.nutrition.carbs"
							:fiber="item.nutrition.fiber"
							:sodium="item.nutrition.sodium"
							:sugar="item.nutrition.sugar"
							:cholesterol="item.nutrition.cholesterol"
							:calories="item.nutrition.calories"
						/>
					</div>
				</div>
				<div
					class="w-full flex justify-center mt-2 text-base-content opacity-50"
				>
					<button class="flex items-center" @click.prevent="addForm">
						<CirclePlus :size="14" /><span class="ml-2"
							>新增一樣食物</span
						>
					</button>
				</div>
				<button
					class="btn btn-primary w-full my-5"
					@click.prevent="submit"
				>
					儲存
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Food } from '@/types/food';
import {
	Sandwich,
	Beef,
	CookingPot,
	CakeSlice,
	CupSoda,
	CirclePlus,
	Delete,
} from 'lucide-vue-next';
import dayjs from 'dayjs';

const { $supabase }: any = useNuxtApp();
const authStore = useAuthStore();
const foodStore = useFoodStore();
const router = useRouter();

const toast = useToast();
const loadingBar = useLoadingBar();

onMounted(() => {
	foodStore.fetchFoods();
});

const mealTypes = [
	{ icon: Sandwich, value: 'breakfast', label: '早餐' },
	{ icon: Beef, value: 'lunch', label: '午餐' },
	{ icon: CookingPot, value: 'dinner', label: '晚餐' },
	{ icon: CakeSlice, value: 'snack', label: '點心' },
	{ icon: CupSoda, value: 'drink', label: '飲品' },
];
const selectedMealType = ref('');

const selectedDate = ref(dayjs().format('YYYY-MM-DD'));

const form = ref([
	{
		sourceId: '',
		quantity: 0,
		photo_url: null,
		searchText: '',
		open: false,
		selectedFood: null as Food | null,
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
		imageUrl: null as string | null,
		selectedFile: null as File | null,
	},
]);

const addForm = () => {
	form.value.push({
		sourceId: '',
		quantity: 0,
		photo_url: null,
		searchText: '',
		open: false,
		selectedFood: null,
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
		imageUrl: null,
		selectedFile: null,
	});
};

const removeForm = (index: number) => {
	form.value.splice(index, 1);
};

//處理照片上傳
const uploadImageToSupabase = async (file: File) => {
	if (!file) return null;
	const fileName = `${Date.now()}_${file.name}`;

	const { data, error } = await $supabase.storage
		.from('meal-log')
		.upload(`${authStore.user?.id}/${fileName}`, file);
	if (error) {
		console.error('圖片上傳失敗', error);
		return null;
	}

	return $supabase.storage.from('meal').getPublicUrl(data.path).data
		.publicUrl;
};

const submit = async () => {
	loadingBar.start();
	try {
		for (const item of form.value) {
			let photoUrl = null;
			if (item.selectedFile) {
				photoUrl = await uploadImageToSupabase(item.selectedFile);
			}

			const { error } = await $supabase.from('meal_log').insert({
				user_id: authStore.user?.id,
				source_type: 'food',
				meal_type: selectedMealType.value,
				source_id: item.sourceId,
				quantity: item.quantity,
				date: selectedDate.value,
				photo_url: item.imageUrl,
			});

			if (error) {
				loadingBar.error();
				toast.show('發生錯誤，請稍後再試', 'error');
				console.error('資料寫入失敗:', error);
				throw error;
			}
		}

		router.push('/diary');
	} catch (error) {
		loadingBar.error();
		toast.show('發生錯誤，請稍後再試', 'error');
		console.error('error:', error);
	}
};

//食物清單
const open = ref(false);
const filteredFoods = ref<Food[]>([]);

const filterFoods = (item: any) => {
	if (!item?.searchText) return;
	const keyword = item.searchText.trim();

	filteredFoods.value = foodStore.foods
		.filter((food: Food) => {
			return (
				food.name?.includes(keyword) || food.alias?.includes(keyword)
			);
		})
		.sort((a: Food, b: Food) => {
			const aNameIndex = a.name.indexOf(keyword);
			const bNameIndex = b.name.indexOf(keyword);

			// 完全相同放最前面
			if (a.name === keyword) return -1;
			if (b.name === keyword) return 1;

			// 名稱開頭包含比較前面
			if (aNameIndex === 0 && bNameIndex !== 0) return -1;
			if (aNameIndex !== 0 && bNameIndex === 0) return 1;

			// 名稱出現位置較小的在前
			if (aNameIndex !== bNameIndex) return aNameIndex - bNameIndex;

			// 最後沒辦法判斷的就維持原本順序
			return 0;
		});
};

const selectFood = (item: any, food: Food) => {
	item.selectedFood = food;
	item.sourceId = food.id;
	item.searchText = food.name;
	item.open = false;
	calculatedNutrition(item);
};

const autoSelectFirst = (item: any) => {
	if (!item.selectedFood && filteredFoods.value.length > 0) {
		selectFood(item, filteredFoods.value[0]);
	}
	item.open = false;
};

//計算營養素
const calculatedNutrition = (item: any) => {
	if (!item?.selectedFood || !item?.nutrition) return;

	const ratio = item.quantity / 100;
	Object.keys(item.nutrition).forEach((key) => {
		item.nutrition[key as keyof typeof item.nutrition] = +(
			item.selectedFood[key] * ratio
		).toFixed(1);
	});
};
</script>

<style scoped></style>
