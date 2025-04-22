<template>
	<div
		v-show="visible"
		class="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
		@click.self="$emit('close')"
	>
		<div
			class="bg-base-100 rounded-lg max-w-sm w-full h-auto transition-all duration-300 overflow-hidden"
		>
			<div class="relative" :class="item?.photo_url ? 'h-64' : 'h-6'">
				<img
					v-if="item?.photo_url"
					:src="item.photo_url"
					class="w-full h-full object-cover"
				/>
				<div v-else class="w-full"></div>
				<div
					class="w-full h-auto absolute top-0 flex justify-between"
					:class="
						item?.photo_url
							? 'bg-gradient-to-b from-black/30 to-transparent text-white'
							: 'text-base-content'
					"
				>
					<X
						:size="40"
						class="p-3 cursor-pointer"
						@click="$emit('close')"
					/>
					<div class="flex">
						<Trash2
							:size="40"
							class="p-3 cursor-pointer"
							@click="$emit('delete', item.id)"
						/>
						<Pencil
							:size="40"
							class="p-3 cursor-pointer"
							@click="$emit('edit', item.id)"
						/>
					</div>
				</div>
			</div>
			<div class="px-3 py-6">
				<div class="flex w-full justify-between">
					<h3 class="text-lg font-bold mb-2">
						{{ item?.food?.name }}
					</h3>
					<p class="text-lg opacity-60">{{ item?.quantity }}g</p>
				</div>
				<div class="h-[150px] w-full">
					<DiaryNutritionChart
						v-if="nutrition"
						class="w-full"
						:protein="nutrition.protein"
						:fat="nutrition.fat"
						:carbs="nutrition.carbs"
						:fiber="nutrition.fiber"
						:sodium="nutrition.sodium"
						:sugar="nutrition.sugar"
						:cholesterol="nutrition.cholesterol"
						:calories="nutrition.calories"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { X, Trash2, Pencil } from 'lucide-vue-next';

defineProps<{
	visible: boolean;
	item: any;
	nutrition: any;
}>();

defineEmits(['close', 'delete', 'edit']);
</script>
