<template>
	<div class="flex flex-col items-center top-5 relative">
		<UiBackButton />
		<h1 class="text-xl mb-8">身體數值紀錄</h1>

		<div class="mx-auto w-full space-y-6 p-5 relative">
			<form>
				<div class="grid gap-2">
					<div>
						<label class="label">紀錄時間</label>
						<input
							v-model="form.recorded_at"
							type="datetime-local"
							class="input input-bordered w-full"
						/>
					</div>
					<div>
						<label class="label">體重（kg）</label>
						<input
							v-model="form.weight"
							type="number"
							step="0.1"
							class="input input-bordered w-full"
						/>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="label">骨骼肌重（kg）</label>
							<input
								v-model="form.muscle_mass"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
							/>
						</div>
						<div>
							<label class="label">體脂肪重（kg）</label>
							<input
								v-model="form.body_fat_mass"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
							/>
						</div>
						<div>
							<label class="label">BMI</label>
							<input
								v-model="form.bmi"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
								:disabled="isBMICalculated"
							/>
						</div>
						<div>
							<label class="label">體脂率（%）</label>
							<input
								v-model="form.body_fat_pct"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
								:disabled="isBodyFatPctCalculated"
							/>
						</div>
						<div>
							<label class="label">內臟脂肪等級</label>
							<input
								v-model="form.visceral_fat"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
							/>
						</div>
						<div>
							<label class="label">腰圍（cm）</label>
							<input
								v-model="form.waist"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
							/>
						</div>
						<div>
							<label class="label">臀圍（cm）</label>
							<input
								v-model="form.hip"
								type="number"
								step="0.1"
								class="input input-bordered w-full"
							/>
						</div>
						<div>
							<label class="label">腰臀比</label>
							<input
								v-model="form.waist_to_hip"
								type="number"
								step="0.01"
								class="input input-bordered w-full"
								:disabled="isWaistToHipCalculated"
							/>
						</div>
					</div>

					<div>
						<label class="label">備註</label>
						<textarea
							v-model="form.note"
							class="textarea textarea-bordered w-full"
							rows="3"
							placeholder="可以記錄當日狀態或其他備註"
						></textarea>
					</div>
				</div>
			</form>

			<div class="flex justify-between">
				<button class="btn btn-primary w-full" @click="submitEvent">
					儲存
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { bodyLog } from '@/types/bodyLog';
const { $supabase }: any = useNuxtApp();
const authStore = useAuthStore();
const toast = useToast();
const loadingBar = useLoadingBar();
const router = useRouter();

const form = ref<bodyLog>({
	recorded_at: '',
	weight: null,
	muscle_mass: null,
	body_fat_mass: null,
	bmi: null,
	body_fat_pct: null,
	visceral_fat: null,
	waist: null,
	hip: null,
	waist_to_hip: null,
	note: '',
});

watch(
	() => form.value.weight,
	(newWeight) => {
		const heightInMeters = authStore.userProfile?.height / 100;
		if (newWeight && heightInMeters) {
			const bmi = newWeight / (heightInMeters * heightInMeters);
			form.value.bmi = parseFloat(bmi.toFixed(1));
		} else {
			form.value.bmi = null;
		}
	}
);

watch([() => form.value.waist, () => form.value.hip], ([waist, hip]) => {
	if (waist && hip && hip !== 0) {
		const ratio = waist / hip;
		form.value.waist_to_hip = parseFloat(ratio.toFixed(2));
	} else {
		form.value.waist_to_hip = null;
	}
});

watch(
	[() => form.value.body_fat_mass, () => form.value.weight],
	([fatMass, weight]) => {
		if (fatMass && weight && weight !== 0) {
			const bodyFatPct = (fatMass / weight) * 100;
			form.value.body_fat_pct = parseFloat(bodyFatPct.toFixed(1));
		} else {
			form.value.body_fat_pct = null;
		}
	}
);

const isBMICalculated = computed(() => form.value.bmi !== null);
const isWaistToHipCalculated = computed(() => form.value.waist_to_hip !== null);
const isBodyFatPctCalculated = computed(() => form.value.body_fat_pct !== null);

onMounted(() => {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	form.value.recorded_at = `${year}-${month}-${day}T${hours}:${minutes}`;
});

const submitEvent = async () => {
	const { recorded_at, note, ...rest } = form.value;

	const hasData = Object.values(rest).some((value) => value !== null);

	if (!hasData) {
		toast.show('請填寫至少一筆資料', 'error');
		return;
	}

	loadingBar.start();
	try {
		const { error } = await $supabase.from('health_records').insert({
			user_id: authStore.user?.id,
			...form.value,
		});

		if (error) throw error;

		loadingBar.end();
		router.push('/tracking');
	} catch (error) {
		loadingBar.error();
		console.error('新增失敗', error);
		toast.show('發生錯誤，請稍後再試', 'error');
	}
};
</script>

<style scoped></style>
