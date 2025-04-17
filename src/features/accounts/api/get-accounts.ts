import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.accounts.$get>;

interface Params {
	initialData: Response;
	enabled?: boolean;
}

export default function createGetAccountsClient(
	params: Params = { initialData: { accounts: [] }, enabled: true }
) {
	const { initialData, enabled } = params;

	const query = createQuery({
		queryKey: ['get', 'accounts'],
		queryFn: async () => {
			const response = await client.api.accounts.$get();

			return response.json();
		},
		initialData,
		enabled
	});

	return query;
}

export type Accounts = InferResponseType<typeof client.api.accounts.$get>;
