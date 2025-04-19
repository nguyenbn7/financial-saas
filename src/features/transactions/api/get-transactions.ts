import type { InferRequestType, InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.transactions.$get>;

type Transaction = Omit<ArrayElement<Response['transactions']>, 'date'> & { date: Date };

export type Transactions = Array<Transaction>;

type SearchParams = InferRequestType<typeof client.api.transactions.$get>['query'];

interface Params {
	ssrData?: Transactions;
}

export default function createGetTransactionsClient(
	params: Params = { ssrData: undefined },
	searchParams: SearchParams = { accountId: undefined, from: undefined, to: undefined }
) {
	const { ssrData } = params;
	let transactions: Transactions = [];

	const query = createQuery<{ transactions: Transactions }, Error>({
		// TODO:
		queryKey: ['get', 'transactions', searchParams],
		queryFn: async () => {
			if (ssrData && transactions.length < 1) {
				transactions = [...ssrData];

				return {
					transactions
				};
			}

			const query = {
				accountId: undefined,
				from: undefined,
				to: undefined
			};

			const response = await client.api.transactions.$get({ query });

			const data = await response.json();
			transactions = [...data.transactions.map((v) => ({ ...v, date: new Date(v.date) }))];

			return {
				transactions
			};
		},
		initialData: {
			transactions
		}
	});

	return query;
}
