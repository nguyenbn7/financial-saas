import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.categories.$get>;

export type Categories = Response['categories'];

interface Params {
	ssrData?: Categories;
}

export default function createGetCategoriesClient(params: Params = { ssrData: undefined }) {
	const { ssrData } = params;
	let categories: Categories = [];

	const query = createQuery({
		queryKey: ['get', 'categories'],
		queryFn: async () => {
			if (ssrData && categories.length < 1) {
				categories = [...ssrData];
				return {
					categories
				};
			}

			const response = await client.api.categories.$get();

			const data = await response.json();
			categories = [...data.categories];

			return {
				categories
			};
		},
		initialData: {
			categories
		}
	});

	return query;
}
