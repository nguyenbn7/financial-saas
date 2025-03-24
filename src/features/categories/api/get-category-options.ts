import type { InferResponseType } from 'hono';

import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

export default function getCategoryOptions() {
	const query = createQuery({
		queryKey: ['category_options'],
		queryFn: async () => {
			const response = await client.api.categories.options.$get();

			return response.json();
		}
	});

	return query;
}

export type CategoryOptions = InferResponseType<typeof client.api.categories.options.$get>;
