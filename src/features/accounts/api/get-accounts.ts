import type { InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.accounts.$get>;

export type Accounts = Response['accounts'];

interface Params {
	ssrData?: Accounts;
}

export default function createGetAccountsClient(params: Params = { ssrData: undefined }) {
	let { ssrData } = params;

	const query = createQuery<Response, Error>({
		queryKey: ['get', 'accounts'],
		queryFn: async () => {
			if (ssrData && ssrData.length > 0) {
				const response = {
					accounts: ssrData
				};
				ssrData = [];
				return response;
			}

			const response = await client.api.accounts.$get();

			return response.json();
		},
		initialData: {
			accounts: ssrData ?? []
		}
	});

	return query;
}
