import type { InferRequestType, InferResponseType } from 'hono';
import type { ClientError } from '$lib/error';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.transactions.$get>;

type Transaction = Omit<ArrayElement<Response['transactions']>, 'date'> & { date: Date };

type SearchParams = InferRequestType<typeof client.api.transactions.$get>['query'];

interface Params {
	initialData: { transactions: Transactions };
	enabled?: boolean;
}

export default function createGetTransactionsClient(
	params: Params = { initialData: { transactions: [] }, enabled: true },
	searchParams: SearchParams = { accountId: undefined, from: undefined, to: undefined }
) {
	const { initialData, enabled } = params;

	const query = createQuery({
		queryKey: ['get', 'transactions', searchParams],
		queryFn: async ({ queryKey }) => {
			const query = (queryKey.at(-1) as SearchParams | undefined) ?? {
				accountId: undefined,
				from: undefined,
				to: undefined
			};

			const response = await client.api.transactions.$get({ query });

			const data = await response.json();
			return {
				transactions: data.transactions.map((v) => ({ ...v, date: new Date(v.date) }))
			};
		},
		initialData,
		enabled
	});

	return query;
}

export type Transactions = Array<Transaction>;
