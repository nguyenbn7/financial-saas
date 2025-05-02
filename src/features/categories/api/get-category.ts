import type { InferResponseType } from 'hono';

import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

import { createQuery, useQueryClient } from '@tanstack/svelte-query';

import { derived, writable } from 'svelte/store';

type ErrorResponse = Extract<
	InferResponseType<(typeof client.api.categories)[':id']['$get']>,
	{ status: number }
>;

type Response = InferResponseType<(typeof client.api.categories)[':id']['$get'], 200>;

export type Category = Response['category'];

interface SSR {
	category?: Category;
}

const emptyCategory: Category = {
	id: '',
	name: '',
	userId: ''
};

const categoryId = writable<string | undefined>(undefined);

export function useCategoryId() {
	return {
		subscribe: categoryId.subscribe,
		set: (id: string | undefined) => categoryId.set(id)
	};
}

export default function useGetCategory(ssr: SSR = { category: undefined }) {
	const { category } = ssr;

	const queryClient = useQueryClient();

	if (category) {
		categoryId.set(category.id);
		queryClient.setQueryData(['get', 'category', category.id], () => ({
			category
		}));
	}

	const query = createQuery<Response, ClientError>(
		derived(categoryId, (id) => ({
			queryKey: ['get', 'category', id],
			queryFn: async () => {
				if (!id) {
					return {
						category: emptyCategory
					};
				}
				const response = await client.api.categories[':id']['$get']({ param: { id } });

				if (!response.ok) {
					const { title, detail, status } = (await response.json()) as ErrorResponse;
					throw new ClientError({ title, detail, status });
				}

				return response.json();
			},
			staleTime: category || !id ? 1000 : 0
		}))
	);

	return query;
}
