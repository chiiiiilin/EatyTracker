<template>
	<div
		v-show="visible"
		class="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
		@click.self="$emit('close')"
	>
		<div
			class="bg-base-100 rounded-lg max-w-sm w-full h-auto max-h-[90vh] overflow-y-auto transition-all duration-300"
		>
			<div class="relative h-6">
				<div
					class="w-full h-auto absolute top-0 flex justify-between text-base-content"
				>
					<X
						:size="42"
						class="p-3 cursor-pointer"
						@click="$emit('close')"
					/>
					<div class="flex">
						<Trash2
							:size="42"
							class="p-3 cursor-pointer"
							@click="$emit('delete', item.id)"
						/>
						<Pencil
							:size="42"
							class="p-3 cursor-pointer"
							@click="startEdit"
						/>
					</div>
				</div>
			</div>

			<div class="px-6 py-6 space-y-6">
				<h3 class="text-lg font-bold">
					{{ formatDate(item.recorded_at) }} 詳細資料
				</h3>

				<table class="table table-md w-full">
					<tbody>
						<template v-for="field in fields" :key="field.key">
							<tr>
								<td class="w-2/3">
									{{ field.label }}
								</td>
								<td class="w-1/3">
									<template v-if="editMode">
										<input
											v-model="editedItem[field.key]"
											type="number"
											class="input input-md w-full"
										/>
									</template>
									<template v-else>
										{{ item[field.key] }}
									</template>
								</td>
							</tr>
						</template>
					</tbody>
				</table>

				<!-- 備註區塊 -->
				<div v-if="editMode">
					<label class="font-bold block mb-1">備註</label>
					<textarea
						v-model="editedItem.note"
						class="textarea textarea-bordered w-full textarea-md"
						placeholder="可以記錄當日狀態或其他備註"
					></textarea>
				</div>
				<div v-else-if="item.note" class="text-md text-base-content">
					<p class="font-bold block">備註：</p>
					<p class="max-h-20 py-3 overflow-y-auto">
						{{ item.note }}
					</p>
				</div>

				<!-- 編輯模式按鈕 -->
				<div v-if="editMode" class="flex justify-end gap-2">
					<button class="btn" @click="cancelEdit">取消</button>
					<button class="btn btn-primary" @click="saveEdit">
						保存
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { bodyLog } from '~/types/bodyLog';
import { X, Trash2, Pencil } from 'lucide-vue-next';

const props = defineProps<{
	visible: boolean;
	item: bodyLog;
}>();

const emit = defineEmits<{
	(e: 'close'): void;
	(e: 'delete', id: string): void;
	(e: 'edit', updatedItem: bodyLog): void;
}>();

const editMode = ref(false);
const editedItem = ref<bodyLog>({} as bodyLog);

const fields = [
	{ label: '體重 (kg)', key: 'weight' },
	{ label: '體脂率 (%)', key: 'body_fat_pct' },
	{ label: '骨骼肌重 (kg)', key: 'muscle_mass' },
	{ label: '體脂肪重 (kg)', key: 'body_fat_mass' },
	{ label: 'BMI', key: 'bmi' },
	{ label: '腰圍 (cm)', key: 'waist' },
	{ label: '臀圍 (cm)', key: 'hip' },
	{ label: '腰臀比', key: 'waist_to_hip' },
	{ label: '內臟脂肪', key: 'visceral_fat' },
] as const;

const formatDate = (dateStr: string) => {
	return new Date(dateStr).toLocaleDateString('ja-JP').slice(0);
};

const startEdit = () => {
	editMode.value = true;
	editedItem.value = { ...props.item };
};

const saveEdit = () => {
	editMode.value = false;
	emit('edit', editedItem.value);
};

const cancelEdit = () => {
	editMode.value = false;
};
</script>
