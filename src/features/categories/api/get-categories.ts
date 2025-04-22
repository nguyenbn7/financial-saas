import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.categories.$get>;

export type Categories = Response['categories'];

interface Params {
	ssrData?: Categories;
}

export default function createGetCategoriesClient(params: Params = { ssrData: undefined }) {
	const { ssrData } = params;

	const queryClient = useQueryClient();

	if (ssrData) {
		queryClient.setQueryData(['get', 'categories'], () => ({
			categories: [...ssrData]
		}));
	}

	const query = createQuery({
		queryKey: ['get', 'categories'],
		queryFn: async () => {
			const response = await client.api.categories.$get();

			const data = await response.json();

			const { categories } = data;

			return {
				categories
			};
		},
		initialData: {
			categories: []
		}
	});

	return query;
}
