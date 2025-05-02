import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);

export default function useNewTransaction() {
	return {
		isOpen: { subscribe },
		onOpen: () => set(true),
		onClose: () => set(false)
	};
}
