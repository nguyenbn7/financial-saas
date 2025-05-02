import { useAccountIdForGetAccount } from '$features/accounts/api';

import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);

const accountId = useAccountIdForGetAccount();

export default function useEditAccount() {
	return {
		isOpen: { subscribe },
		accountId: { subscribe: accountId.subscribe },
		onOpen: (id: string) => {
			set(true);
			accountId.set(id);
		},
		onClose: () => {
			set(false);
			accountId.set(undefined);
		}
	};
}
