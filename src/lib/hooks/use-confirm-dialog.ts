import { writable } from 'svelte/store';

const defaultAutoOpen = true;

interface Options {
	title?: string;
	description?: string;
	autoOpen?: boolean;
}

const promiseStore = writable<{ resolve: (value: boolean) => void } | null>(null);
const isOpenStore = writable(false);
const titleStore = writable<string | null | undefined>(undefined);
const descriptionStore = writable<string | null | undefined>(undefined);

export function useConfirm() {
	function confirm(options: Options = {}) {
		const { title, description, autoOpen } = options;

		titleStore.set(title);
		descriptionStore.set(description);
		isOpenStore.set(autoOpen ?? defaultAutoOpen);

		return new Promise((resolve: (value: boolean) => void, reject) => {
			promiseStore.set({ resolve });
		});
	}

	const handleClose = () => {
		promiseStore.set(null);
		isOpenStore.set(false);
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
		isOpen: { subscribe: isOpenStore.subscribe },
		title: { subscribe: titleStore.subscribe },
		description: { subscribe: descriptionStore.subscribe },
		confirm,
		handleClose,
		handleConfirm,
		handleCancel
	};
}
