import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);

export function useNewCategory() {
	return {
		isOpen: { subscribe },
		onOpen: () => set(true),
		onClose: () => set(false)
	};
}
