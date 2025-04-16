import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

export default function createGetAccountsClient() {
	const query = createQuery({
		queryKey: ['get', 'accounts'],
		queryFn: async () => {
			const response = await client.api.accounts.$get();

			return response.json();
		}
	});

	return query;
}

export type Accounts = InferResponseType<typeof client.api.accounts.$get>;
