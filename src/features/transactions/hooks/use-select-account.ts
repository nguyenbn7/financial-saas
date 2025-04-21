import { writable } from 'svelte/store';

const promiseStore = writable<{ resolve: (value: boolean) => void } | null>(null);

export function useSelectAccount() {
	return {
		confirm: () => new Promise((resolve, reject) => promiseStore.set({ resolve }))
	};
}
