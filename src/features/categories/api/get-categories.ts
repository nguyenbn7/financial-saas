import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.categories.$get>;

export type Categories = Response['categories'];

interface Params {
	ssrData?: Categories;
}

export default function createGetCategoriesClient(params: Params = { ssrData: undefined }) {
	let { ssrData } = params;

	const query = createQuery({
		queryKey: ['get', 'categories'],
		queryFn: async () => {
			const response = await client.api.categories.$get();

			return response.json();
		},
		initialData: {
			categories: ssrData ?? []
		}
	});

	return query;
}
