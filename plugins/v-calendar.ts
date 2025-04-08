// plugins/v-calendar.ts
import { setupCalendar } from 'v-calendar';
import 'v-calendar/style.css';

export default defineNuxtPlugin((nuxtApp) => {
	setupCalendar(nuxtApp.vueApp, {
		masks: {
			input: 'YYYY/MM/DD',
			title: 'YYYY年 MMM',
		},
	});
});
