<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	Colors,
} from 'chart.js';

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	Colors
);

const props = defineProps<{
	protein: number;
	fat: number;
	carbs: number;
	fiber: number;
	sodium: number;
	sugar: number;
	cholesterol: number;
	calories: number;
}>();

const chartData = ref<ChartData<'bar'>>({
	labels: [''],
	datasets: [],
});

watch(
	() => props,
	(val) => {
		chartData.value = {
			labels: [''],
			datasets: [
				{ label: `蛋白質 ${val.protein} g`, data: [val.protein] },
				{ label: `脂肪 ${val.fat} g`, data: [val.fat] },
				{ label: `碳水 ${val.carbs} g`, data: [val.carbs] },
				{ label: `膳食纖維 ${val.fiber} g`, data: [val.fiber] },
				{ label: `鈉 ${val.sodium} mg`, data: [val.sodium / 1000] },
				{ label: `糖分 ${val.sugar} g`, data: [val.sugar] },
				{
					label: `膽固醇 ${val.cholesterol} mg`,
					data: [val.cholesterol / 1000],
				},
			],
		};
	},
	{ immediate: true, deep: true }
);

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
	maintainAspectRatio: false,
	indexAxis: 'y',
	responsive: true,
	plugins: {
        title: {
      display: true,
      text: `熱量 ${props.calories} kcal`,
      font: {
        size: 14,
      },
      padding: {
        bottom: 5,
      },
    },
		legend: {
			display: true,
			position: 'bottom',
			labels: {
				filter: (legendItem) => {
					const showLabels = ['蛋白質', '脂肪', '碳水'];
					return showLabels.some((l) => legendItem.text.includes(l));
				},
			},
		},

		colors: {
			forceOverride: true,
		},
		tooltip: {
			callbacks: {
				label: function (context) {
					return context.dataset.label;
				},
			},
		},
	},
	scales: {
		x: {
			stacked: true,
			max:
				props.protein +
				props.fat +
				props.carbs +
				props.fiber +
				props.sodium / 1000 +
				props.sugar +
				props.cholesterol / 1000,
			grid: { display: false },
			ticks: { display: false },
		},
		y: {
			stacked: true,
			grid: { display: false },
			ticks: { display: false },
		},
	},
}));
</script>

<template>
	<Bar :data="chartData" :options="chartOptions" />
</template>
