import { writable } from 'svelte/store';

const { subscribe: subscribeOpen, set: setOpen } = writable(false);
const { subscribe: subscribeId, set: setId } = writable<string | undefined>(undefined);

export function useEditAccount() {
	return {
		isOpen: { subscribe: subscribeOpen },
		accountId: { subscribe: subscribeId },
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
