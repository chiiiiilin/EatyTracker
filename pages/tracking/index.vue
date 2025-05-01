<template>
	<div class="py-12 relative">
		<NuxtLink
			class="btn btn-xs btn-outline btn-primary absolute right-8 top-14"
			to="/tracking/bodyLog"
			>+ 新增紀錄</NuxtLink
		>
		<div class="tabs tabs-border">
			<!-- 趨勢圖 tab -->
			<input
				type="radio"
				name="my_tabs_2"
				class="tab"
				aria-label="趨勢圖"
				:checked="true"
			/>
			<div class="tab-content">
				<client-only>
					<div
						class="flex flex-col items-center top-4 relative w-full max-w-2xl px-4 space-y-6"
					>
						<div
							v-for="(chart, index) in charts"
							:key="index"
							class="h-36 w-full"
						>
							<Line
								v-if="loaded"
								:data="chart.data"
								:options="chart.options"
							/>
						</div>
					</div>
				</client-only>
			</div>
			<!-- 紀錄 tab -->
			<input
				type="radio"
				name="my_tabs_2"
				class="tab"
				aria-label="紀錄"
			/>
			<div class="tab-content">
				<div class="overflow-x-auto">
					<table class="table table-md table-pin-rows">
						<thead>
							<tr>
								<th>日期</th>
								<th>體重</th>
								<th>體脂率</th>
								<th>骨骼肌重</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(item, index) in paginatedLogs"
								:key="index"
								@click="openModal(item)"
								class="cursor-pointer hover:bg-base-200"
							>
								<td>{{ formatDate(item.recorded_at) }}</td>
								<td>{{ item.weight }}</td>
								<td>{{ item.body_fat_pct }}</td>
								<td>{{ item.muscle_mass }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<transition name="fade">
			<TrackingBodyLogDetailModal
				v-if="showModal"
				:visible="showModal"
				:item="selectedItem"
				@close="showModal = false"
				@delete="handleDelete"
				@edit="handleEdit"
			/>
		</transition>

		<div v-if="totalPages > 1" class="flex justify-center mt-6">
			<div class="join">
				<button
					class="join-item btn btn-square"
					:disabled="page === 1"
					@click="goToPage(1)"
				>
					«
				</button>
				<button
					class="join-item btn btn-square"
					:disabled="page === 1"
					@click="prevPage"
				>
					‹
				</button>
				<template v-for="p in pagesToShow" :key="p">
					<button
						class="join-item btn btn-square"
						:class="{ 'btn-active': page === p }"
						@click="goToPage(p)"
					>
						{{ p }}
					</button>
				</template>

				<button
					class="join-item btn btn-square"
					:disabled="page === totalPages"
					@click="nextPage"
				>
					›
				</button>
				<button
					class="join-item btn btn-square"
					:disabled="page === totalPages"
					@click="goToPage(totalPages)"
				>
					»
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { bodyLog } from '@/types/bodyLog';
import { Line } from 'vue-chartjs';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Colors,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

interface ChartConfig {
	data: ChartData<'line'>;
	options: ChartOptions<'line'>;
}

const authStore = useAuthStore();
const { $supabase }: any = useNuxtApp();
const loadingBar = useLoadingBar();
const toast = useToast();
const loaded = ref(false);

onMounted(async () => {
	await authStore.fetchUser();
	await authStore.fetchUserBodyLog();

	if (typeof window !== 'undefined') {
		const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
		const annotationPlugin = (await import('chartjs-plugin-annotation'))
			.default;
		ChartJS.register(
			Title,
			Tooltip,
			Legend,
			LineElement,
			CategoryScale,
			LinearScale,
			PointElement,
			Colors,
			zoomPlugin,
			annotationPlugin
		);
		loaded.value = true;
	}
});

const page = ref(1);
const pageSize = 12;

const sortedLogs = computed(() => {
	return [...authStore.userBodyLog].sort((a, b) => {
		return (
			new Date(b.recorded_at).getTime() -
			new Date(a.recorded_at).getTime()
		);
	});
});

const paginatedLogs = computed(() => {
	const start = (page.value - 1) * pageSize;
	const end = start + pageSize;
	return sortedLogs.value.slice(start, end);
});

const totalPages = computed(() => {
	return Math.ceil(sortedLogs.value.length / pageSize);
});

// 換頁邏輯
const goToPage = (target: number) => {
	if (target >= 1 && target <= totalPages.value) {
		page.value = target;
	}
};

const prevPage = () => {
	if (page.value > 1) {
		page.value--;
	}
};

const nextPage = () => {
	if (page.value < totalPages.value) {
		page.value++;
	}
};

// 動態顯示的頁碼列表
const pagesToShow = computed(() => {
	const pages: number[] = [];
	const range = 2; // 前後各顯示2頁

	let start = page.value - range;
	let end = page.value + range;

	if (start < 1) {
		end += 1 - start;
		start = 1;
	}
	if (end > totalPages.value) {
		start -= end - totalPages.value;
		end = totalPages.value;
	}
	if (start < 1) {
		start = 1;
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
});

//紀錄的彈窗
const showModal = ref(false);
const selectedItem = ref<any>(null);

const openModal = (item: any) => {
	selectedItem.value = item;
	showModal.value = true;
};

const handleDelete = async (id: string) => {
	loadingBar.start();
	try {
		const { error } = await $supabase
			.from('body_logs')
			.delete()
			.eq('id', id);

		if (error) throw error;

		loadingBar.end();
		await authStore.fetchUserBodyLog();
		showModal.value = false;
	} catch (error) {
		loadingBar.error();
		toast.show('發生錯誤，請稍後重試', 'error');
	}
};

const handleEdit = async (updatedItem: bodyLog) => {
	loadingBar.start();
	try {
		const { error } = await $supabase
			.from('body_logs')
			.update({ ...updatedItem })
			.eq('id', updatedItem.id);

		if (error) throw error;

		loadingBar.end();
		await authStore.fetchUserBodyLog();
		showModal.value = false;
	} catch (error) {
		loadingBar.error();
		toast.show('發生錯誤，請稍後重試', 'error');
	}
};

const formatDate = (dateStr: string) => {
	return new Date(dateStr).toLocaleDateString('ja-JP').slice(0);
};

//黑暗模式
const isDark = ref(false);
onMounted(() => {
	isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
});

// 基本設定與計算
const gender = computed(() => authStore.userProfile.gender);
const height = computed(() => authStore.userProfile.height / 100);

// 日期標籤
const labels = computed(() => {
	return authStore.userBodyLog.map((record: bodyLog) =>
		new Date(record.recorded_at).toISOString().slice(0, 10)
	);
});

// 可視範圍設定
const visibleCount = 8;
const totalDataCount = computed(() => labels.value.length);
const minIndex = computed(() =>
	totalDataCount.value > visibleCount
		? totalDataCount.value - visibleCount
		: 0
);
const maxIndex = computed(() => totalDataCount.value - 1);

// 基本圖表配置
const baseOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: true,
			align: 'start',
			text: '',
			font: {
				size: 16,
			},
			padding: {
				bottom: 15,
			},
		},
		zoom: {
			zoom: {
				wheel: { enabled: true },
				pinch: { enabled: true },
				mode: 'x',
			},
			pan: {
				enabled: true,
				mode: 'x',
			},
			limits: {
				x: { minRange: 1 },
			},
		},
	},
	scales: {
		x: {
			min: minIndex.value,
			max: maxIndex.value,
			ticks: {
				maxRotation: 0,
			},
		},
		y: {
			beginAtZero: false,
		},
		y1: {
			display: false,
			grid: {
				drawOnChartArea: false,
			},
		},
	},
}));

// 取得過濾後的數值，並計算最小/最大值
const getFilteredValues = (data: (number | null)[]) => {
	const filteredData = data.filter((d): d is number => d !== null);
	return {
		values: filteredData,
		min: Math.min(...filteredData),
		max: Math.max(...filteredData),
	};
};

// 生成 Y 軸範圍
const generateYAxisRange = (min: number, max: number, padding = 1) => {
	return {
		min: min - padding,
		max: max + padding,
	};
};

// 創建註解配置
const createAnnotation = (yMin: number, yMax: number) => {
	return {
		clip: true,
		annotations: {
			weightRange: {
				type: 'box',
				yMin,
				yMax,
				backgroundColor: isDark.value
					? 'rgba(50, 104, 70, 0.3)'
					: 'rgba(209, 232, 214, 0.3)',
				borderWidth: 0,
			},
		},
	};
};

// 創建圖表配置
const createChartOptions = (
	title: string,
	yMin: number,
	yMax: number,
	annotation?: any
) => {
	const options = JSON.parse(JSON.stringify(baseOptions.value));
	options.plugins.title.text = title;
	options.scales.y.min = yMin;
	options.scales.y.max = yMax;

	if (annotation) {
		options.plugins.annotation = annotation;
	}

	return options;
};

// 創建圖表數據
const createChartData = (
	label: string,
	data: (number | null)[],
	color: string,
	yAxisID = 'y'
) => {
	return {
		labels: labels.value,
		datasets: [
			{
				label,
				data,
				tension: 0.3,
				fill: false,
				spanGaps: true,
				borderColor: color,
				backgroundColor: color,
				yAxisID,
			},
		],
	};
};

// 圖表數據定義
// 體重
const weightData = computed(() => {
	const data = authStore.userBodyLog.map((record: bodyLog) => record.weight);
	return createChartData('體重 (kg)', data, '#36A2EB');
});

// 體重範圍
const normalWeightRange = computed(() => {
	const min = +(height.value * height.value * 18.5).toFixed(1);
	const max = +(height.value * height.value * 24).toFixed(1);
	return { min, max };
});

// 體重圖表設定
const weightConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		weightData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const options = createChartOptions(
		'體重(kg)',
		yMin,
		yMax,
		createAnnotation(
			normalWeightRange.value.min,
			normalWeightRange.value.max
		)
	);

	return { data: weightData.value, options };
});

// 骨骼肌
const muscleMassData = computed(() => {
	const data = authStore.userBodyLog.map(
		(record: bodyLog) => record.muscle_mass
	);
	return createChartData('骨骼肌重 (kg)', data, '#FF6384');
});

// 骨骼肌圖表設定
const muscleMassConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		muscleMassData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const options = createChartOptions('骨骼肌重(kg)', yMin, yMax);

	return { data: muscleMassData.value, options };
});

// 體脂肪
const fatMassData = computed(() => {
	const data = authStore.userBodyLog.map(
		(record: bodyLog) => record.body_fat_mass
	);
	return createChartData('體脂肪重 (kg)', data, '#4BC0C0');
});

// 體脂肪圖表設定
const fatMassConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		fatMassData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const options = createChartOptions('脂肪重(kg)', yMin, yMax);

	return { data: fatMassData.value, options };
});

// BMI
const bmiData = computed(() => {
	const data = authStore.userBodyLog.map((record: bodyLog) => record.bmi);
	return createChartData('BMI', data, '#FF9F40');
});

// BMI 圖表設定
const bmiConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		bmiData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max, 0.5);
	const options = createChartOptions(
		'BMI',
		yMin,
		yMax,
		createAnnotation(18.5, 24)
	);

	return { data: bmiData.value, options };
});

// 體脂率
const fatPctData = computed(() => {
	const data = authStore.userBodyLog.map(
		(record: bodyLog) => record.body_fat_pct
	);
	return createChartData('體脂率', data, '#9966FF');
});

// 體脂率圖表設定
const fatPctConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		fatPctData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const minNormal = gender.value === 'female' ? 18 : 10;
	const maxNormal = gender.value === 'female' ? 30 : 20;
	const options = createChartOptions(
		'體脂率(%)',
		yMin,
		yMax,
		createAnnotation(minNormal, maxNormal)
	);

	return { data: fatPctData.value, options };
});

// 內臟脂肪
const visceralFatData = computed(() => {
	const data = authStore.userBodyLog.map(
		(record: bodyLog) => record.visceral_fat
	);
	return createChartData('內臟脂肪等級', data, '#FFCD56');
});

// 內臟脂肪圖表設定
const visceralFatConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		visceralFatData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const options = createChartOptions(
		'內臟脂肪等級',
		yMin,
		yMax,
		createAnnotation(1, 9)
	);

	return { data: visceralFatData.value, options };
});

// 腰圍
const waistData = computed(() => {
	const data = authStore.userBodyLog.map((record: bodyLog) => record.waist);
	return createChartData('腰圍', data, '#36A2EB', 'y');
});

// 腰圍圖表設定
const waistConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		waistData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const options = createChartOptions('腰圍(cm)', yMin, yMax);

	return { data: waistData.value, options };
});

// 臀圍
const hipData = computed(() => {
	const data = authStore.userBodyLog.map((record: bodyLog) => record.hip);
	return createChartData('臀圍', data, '#FF6384', 'y');
});

// 臀圍圖表設定
const hipConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		hipData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max);
	const options = createChartOptions('臀圍(cm)', yMin, yMax);

	return { data: hipData.value, options };
});

// 腰臀比
const waistToHipData = computed(() => {
	const data = authStore.userBodyLog.map(
		(record: bodyLog) => record.waist_to_hip
	);
	return createChartData('腰臀比', data, '#4BC0C0', 'y');
});

// 腰臀比圖表設定
const waistToHipConfig = computed(() => {
	const { values, min, max } = getFilteredValues(
		waistToHipData.value.datasets[0].data
	);
	const { min: yMin, max: yMax } = generateYAxisRange(min, max, 0.05);
	const options = createChartOptions('腰臀比', yMin, yMax);

	return { data: waistToHipData.value, options };
});

// 組合所有圖表
const charts = computed<ChartConfig[]>(() => [
	weightConfig.value,
	muscleMassConfig.value,
	fatMassConfig.value,
	bmiConfig.value,
	fatPctConfig.value,
	visceralFatConfig.value,
	waistConfig.value,
	hipConfig.value,
	waistToHipConfig.value,
]);
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
