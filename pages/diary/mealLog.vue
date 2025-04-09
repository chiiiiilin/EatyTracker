<template>
	<div class="top-5 relative">
		<UiBackButton />
		<h1 class="text-xl w-full text-center">新增飲食紀錄</h1>
		<form action="" class="mt-10 mx-8">
			<div class="flex justify-between">
				<div
					v-for="type in mealTypes"
					class="py-2 px-4 rounded-md bg-base-300 cursor-pointer text-info-content opacity-20"
				>
					<component :is="type.icon" :size="28" />
					<span class="text-xs">{{ type.label }}</span>
				</div>
			</div>
			<div class="mt-5 flex justify-between items-end">
				<UiImageUploader
					path="meal_images"
					v-model:file="selectedFile"
					v-model:url="imageUrl"
				/>
				<div class="w-full pl-4">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">食物名稱</legend>
						<div class="dropdown w-full">
							<div class="input input-sm" @click="open = true">
								<input
									v-model="searchText"
									type="text"
									placeholder="搜尋食物"
									@input="filterFoods"
									@focus="open = true"
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
										@mousedown.prevent="selectFood(food)"
										class="block truncate w-full p-2 cursor-pointer hover:bg-primary-content"
									>
										{{ food.name }}
									</div>
								</li>
							</ul>
						</div>

						<legend class="fieldset-legend">食用份量 (公克)</legend>
						<input
							type="number"
							class="input input-sm"
							placeholder="填入克數"
						/>
					</fieldset>
				</div>
			</div>
		</form>
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
	Search,
} from 'lucide-vue-next';
const foodStore = useFoodStore();

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

//處理照片上傳
const selectedFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);

const uploadImageToSupabase = async () => {
	// if (!selectedFile.value) return null;
	// const fileName = `${Date.now()}_${selectedFile.value.name}`;
	// const { data, error } = await $supabase.storage
	// 	.from('meal') 
	// 	.upload(`meal_images/${fileName}`, selectedFile.value);
	// if (error) {
	// 	console.error('圖片上傳失敗', error);
	// 	return null;
	// }
	// return data.path;
};

const submitMeal = async () => {
	//   const uploadedPath = await uploadImageToSupabase();
	//   const imageUrlToSave = uploadedPath
	//     ? $supabase.storage.from('meal').getPublicUrl(uploadedPath).data.publicUrl
	//     : null;
	//   // 接著寫入 meal_log 資料
	//   await $supabase.from('meal_log').insert({
	//     user_id: yourUserId,
	//     meal_type: 'breakfast',
	//     image_url: imageUrlToSave,
	//     ...
	//   });
};

//食物清單
const searchText = ref('');
const open = ref(false);
const filteredFoods = ref<Food[]>([]);
const selectedFood = ref<Food | null>(null);

const filterFoods = () => {
	const keyword = searchText.value.toLowerCase();
	filteredFoods.value = foodStore.foods.filter((food: Food) => {
		const nameMatch = food.name.toLowerCase().includes(keyword);
		const aliasMatch =
			food.alias && food.alias.toLowerCase().includes(keyword);
		return nameMatch || aliasMatch;
	});
};

const selectFood = (food: Food) => {
	selectedFood.value = food;
	searchText.value = food.name;
	open.value = false;
};
</script>

<style scoped></style>
