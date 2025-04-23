import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.categories.$get>;

export type Categories = Response['categories'];

interface SSR {
	categories?: Categories;
}

export default function createGetCategoriesClient(ssr: SSR = { categories: undefined }) {
	const { categories } = ssr;

	const queryClient = useQueryClient();

	if (categories) {
		queryClient.setQueryData(['get', 'categories'], () => ({
			categories: [...categories]
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
		},
		// With SSR, we usually want to set some default staleTime
		// above 0 to avoid refetching immediately on the client
		staleTime: 1000 // 1 sec
	});

	return query;
}
