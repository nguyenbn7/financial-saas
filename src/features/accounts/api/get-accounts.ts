import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

interface Params {
	initialData: any;
}

export default function createGetAccountsClient(params: Params = { initialData: undefined }) {
	const { initialData } = params;

	const query = createQuery({
		queryKey: ['get', 'accounts'],
		queryFn: async () => {
			const response = await client.api.accounts.$get();

			return response.json();
		},
		initialData
	});

	return query;
}

export type Accounts = InferResponseType<typeof client.api.accounts.$get>;
