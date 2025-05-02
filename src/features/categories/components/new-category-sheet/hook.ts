import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);

export default function useNewCategory() {
	return {
		isOpen: { subscribe },
		onOpen: () => set(true),
		onClose: () => set(false)
	};
}
