import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.accounts.$get>;

export type Accounts = Response['accounts'];

interface Params {
	ssrData?: Accounts;
}

export default function createGetAccountsClient(params: Params = { ssrData: undefined }) {
	const { ssrData } = params;
	let accounts: Accounts = [];

	const query = createQuery<Response, Error>({
		queryKey: ['get', 'accounts'],
		queryFn: async () => {
			if (ssrData && accounts.length < 1) {
				accounts = [...ssrData];
				return {
					accounts
				};
			}

			const response = await client.api.accounts.$get();

			const data = await response.json();
			accounts = [...data.accounts];

			return {
				accounts
			};
		},
		initialData: {
			accounts
		}
	});

	return query;
}
