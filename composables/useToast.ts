import { inject } from 'vue';

export const useToast = () => {
	const toast = inject('toast') as any;

	if (!toast) {
		console.warn('[useToast] Toast 尚未註冊');
		return {
			show: () => {},
		};
	}

	return {
		show: (
			message: string,
			type: 'success' | 'error' | 'info' = 'info'
		) => {
			toast.value?.show(message, type);
		},
	};
};
