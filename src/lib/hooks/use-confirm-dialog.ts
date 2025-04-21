import { writable } from 'svelte/store';

interface Options {
	title?: string;
	description?: string;
}

const promiseStore = writable<{ resolve: (value: boolean) => void } | null>(null);
const titleStore = writable<string | null | undefined>(undefined);
const descriptionStore = writable<string | null | undefined>(undefined);

export function useConfirm() {
	function confirm(options: Options = {}) {
		const { title, description } = options;

		titleStore.set(title);
		descriptionStore.set(description);

		return new Promise((resolve: (value: boolean) => void, reject) => {
			promiseStore.set({ resolve });
		});
	}

	const handleClose = () => {
		promiseStore.set(null);
		titleStore.set(undefined);
		descriptionStore.set(undefined);
	};

	const handleConfirm = () => {
		promiseStore.update((v) => v?.resolve(true) ?? null);

		handleClose();
	};

	const handleCancel = () => {
		promiseStore.update((v) => v?.resolve(false) ?? null);

		handleClose();
	};
	return {
		promise: { subscribe: promiseStore.subscribe },
		title: { subscribe: titleStore.subscribe },
		description: { subscribe: descriptionStore.subscribe },
		confirm,
		handleConfirm,
		handleCancel
	};
}
