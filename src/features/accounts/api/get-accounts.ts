import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.accounts.$get>;

export type Accounts = Response['accounts'];

interface SSR {
	accounts?: Accounts;
}

export default function createGetAccountsClient(ssr: SSR = { accounts: undefined }) {
	const { accounts } = ssr;

	const queryClient = useQueryClient();

	if (accounts) {
		queryClient.setQueryData(['get', 'accounts'], () => ({
			accounts: [...accounts]
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
		},
		// With SSR, we usually want to set some default staleTime
		// above 0 to avoid refetching immediately on the client
		staleTime: 1000 // 1 sec
	});

	return query;
}
