import { useCategoryIdForGetCategory } from '$features/categories/api';

import { writable } from 'svelte/store';

const { subscribe, set } = writable(false);
const categoryId = useCategoryIdForGetCategory();

export default function useEditCategory() {
	return {
		isOpen: { subscribe },
		categoryId: { subscribe: categoryId.subscribe },
		onOpen: (id: string) => {
			set(true);
			categoryId.set(id);
		},
		onClose: () => {
			set(false);
			categoryId.set(undefined);
		}
	};
}
