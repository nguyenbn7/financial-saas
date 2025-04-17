import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.categories.$get>;

interface Params {
	initialData: Response;
	enabled?: boolean;
}

export default function createGetCategoriesClient(
	params: Params = { initialData: { categories: [] }, enabled: true }
) {
	const { initialData, enabled } = params;

	const query = createQuery({
		queryKey: ['get', 'categories'],
		queryFn: async () => {
			const response = await client.api.categories.$get();

			return response.json();
		},
		initialData,
		enabled
	});

	return query;
}

export type Categories = Response['categories'];
