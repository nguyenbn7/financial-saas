import { useTransactionIdForGetTransaction } from '$features/transactions/api';

import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);
const transactionId = useTransactionIdForGetTransaction();

export default function useEditTransaction() {
	return {
		isOpen: { subscribe },
		transactionId: { subscribe: transactionId.subscribe },
		onOpen: (id: string) => {
			set(true);
			transactionId.set(id);
		},
		onClose: () => {
			set(false);
			transactionId.set(undefined);
		}
	};
}
