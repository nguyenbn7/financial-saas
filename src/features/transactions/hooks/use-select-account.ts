import { get, writable } from 'svelte/store';

const promiseStore = writable<{ resolve: (value: string | undefined) => void } | null>(null);

export const selectedValue = writable<string | undefined>();

export function useSelectAccount() {
	function confirm() {
		return new Promise((resolve: (value: string | undefined) => void, reject) =>
			promiseStore.set({ resolve })
		);
	}

	function handleClose() {
		promiseStore.set(null);
	}

	function handleConfirm() {
		promiseStore.update((v) => v?.resolve(get(selectedValue)) ?? null);
		handleClose();
	}

	function handleCancel() {
		promiseStore.update((v) => v?.resolve(undefined) ?? null);
		handleClose();
	}

	return {
		promise: { subscribe: promiseStore.subscribe },
		confirm,
		handleClose,
		handleConfirm,
		handleCancel
	};
}
