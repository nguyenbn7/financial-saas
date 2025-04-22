import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.accounts.$get>;

export type Accounts = Response['accounts'];

interface Params {
	ssrData?: Accounts;
}

export default function createGetAccountsClient(params: Params = { ssrData: undefined }) {
	const { ssrData } = params;

	const queryClient = useQueryClient();

	if (ssrData) {
		queryClient.setQueryData(['get', 'accounts'], () => ({
			accounts: [...ssrData]
		}));
	}

	const query = createQuery<Response, Error>({
		queryKey: ['get', 'accounts'],
		queryFn: async () => {
			const response = await client.api.accounts.$get();

			const data = await response.json();

			const { accounts } = data;

			return {
				accounts
			};
		},
		initialData: {
			accounts: []
		}
	});

	return query;
}
