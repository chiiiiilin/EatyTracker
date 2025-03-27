export const useLoadingBar = () => {
	const instance = inject('loadingBar') as Ref<any>;
	if (!instance?.value) {
		console.warn('loadingBar not provided');
	}
	return {
		start: () => instance?.value?.start?.(),
		end: () => instance?.value?.end?.(),
		error: () => instance?.value?.error?.(),
	};
};
