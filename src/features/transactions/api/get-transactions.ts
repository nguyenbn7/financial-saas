import type { InferRequestType, InferResponseType } from 'hono';
import { client } from '$lib/rpc';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

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

	const queryClient = useQueryClient();

	if (ssrData) {
		queryClient.setQueryData(['get', 'transactions', searchParams], () => ({
			transactions: [...ssrData]
		}));
	}

	const query = createQuery<{ transactions: Transactions }, Error>({
		// TODO:
		queryKey: ['get', 'transactions', searchParams],
		queryFn: async () => {
			const query = {
				accountId: undefined,
				from: undefined,
				to: undefined
			};

			const response = await client.api.transactions.$get({ query });

			const data = await response.json();
			const transactions = [...data.transactions.map((v) => ({ ...v, date: new Date(v.date) }))];

			return {
				transactions
			};
		},
		initialData: {
			transactions: []
		}
	});

	return query;
}
