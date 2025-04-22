<template>
	<div class="flex flex-col items-center p-4">
		<button
			class="text-2xl font-semibold translate-y-8 z-10"
			@click="setToday"
		>
			{{ formattedDate }}
		</button>
		<Calendar
			ref="calendar"
			v-model="selectedDate"
			:view="showCalendar ? 'monthly' : 'weekly'"
			transparent
			borderless
			:is-dark="isDark"
			:attributes="calendarAttrs"
			:locale="locale"
			@dayclick="onSelectDate"
		/>
		<button
			class="w-20 h-1 bg-neutral-content rounded-sm"
			@click="toggleCalendar"
		></button>
	</div>
</template>

<script setup lang="ts">
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';

const calendar = ref();
const showCalendar = ref(false);
const selectedDate = ref(new Date());

const isDark = ref(false);

const emit = defineEmits<{
	(e: 'update:selectedDate', date: Date): void;
}>();

onMounted(() => {
	isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
});

const formattedDate = computed(() => {
	const d = selectedDate.value;
	return `${d.getFullYear()}/${(d.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
});

const toggleCalendar = async () => {
	showCalendar.value = !showCalendar.value;
	await nextTick();
	calendar.value?.move(selectedDate.value);
};

const onSelectDate = (day: { date: Date }) => {
	selectedDate.value = day.date;
	emit('update:selectedDate', day.date);
};

const setToday = () => {
	const today = new Date();
	selectedDate.value = today;
	calendar.value?.move(today);
};

const calendarAttrs = computed(() => [
	{
		key: 'today',
		highlight: {
			contentClass: isDark.value
				? 'bg-accent-content text-white'
				: 'bg-parimary text-white',
		},
		dates: [new Date()],
	},
	{
		key: 'selected',
		highlight: {
			contentClass: isDark.value
				? 'bg-primary text-white'
				: 'bg-black text-white',
		},
		dates: [selectedDate.value],
	},
]);

const locale = {
	id: 'zh-TW',
	firstDayOfWeek: 2,
	masks: {
		title: 'YYYY/MM',
	},
};
</script>

<style scoped>
:deep(.vc-day-content) {
	transition: background-color 0.2s;
}
:deep(.vc-container) {
	width: 100vw;
	max-width: 468px;
	padding: 0 15px;
}
:deep(.vc-title) {
	display: none !important;
}
</style>
