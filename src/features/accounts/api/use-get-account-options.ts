import { client } from '$lib/hono.rpc';
import { createQuery } from '@tanstack/svelte-query';

export function useGetAccountOptions() {
	const query = createQuery({
		queryKey: ['accountOptions'],
		queryFn: async () => {
			const response = await client.api.accounts.$get();

			if (!response.ok) {
				throw new Error('Failed to fetch account options');
			}

			return response.json();
		}
	});

	return query;
}

export type UseGetAccountOptions = ReturnType<typeof useGetAccountOptions>;
