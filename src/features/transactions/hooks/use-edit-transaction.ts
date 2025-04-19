import { writable } from 'svelte/store';

const { subscribe: subscribeOpen, set: setOpen } = writable(false);
const { subscribe: subscribeId, set: setId } = writable<string | undefined>(undefined);

export function useEditTransaction() {
	return {
		isOpen: { subscribe: subscribeOpen },
		transactionId: { subscribe: subscribeId },
		onOpen: (id: string) => {
			setOpen(true);
			setId(id);
		},
		onClose: () => {
			setOpen(false);
			setId(undefined);
		}
	};
}
