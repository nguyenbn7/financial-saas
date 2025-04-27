import type { InferResponseType } from 'hono';
import { derived, get } from 'svelte/store';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';
import { useSearchParams } from '$lib/hooks.svelte';
import { convertAmountFromMiliunits } from '$lib';
import { client } from '$lib/rpc';

type Response = InferResponseType<typeof client.api.transactions.$get>;

type Transaction = Omit<ArrayElement<Response['transactions']>, 'date'> & { date: Date };

export type Transactions = Array<Transaction>;

interface SSR {
	transactions?: Transactions;
}

export default function createGetTransactionsClient(ssr: SSR = { transactions: undefined }) {
	const { transactions: transactionsFromSSR } = ssr;

	const queryClient = useQueryClient();

	const searchParams = useSearchParams();

	if (transactionsFromSSR) {
		queryClient.setQueryData(['get', 'transactions', get(searchParams)], () => ({
			transactions: [...transactionsFromSSR]
		}));
	}

	const query = createQuery<{ transactions: Transactions }, Error>(
		derived(searchParams, (query) => ({
			queryKey: ['get', 'transactions', query],
			queryFn: async () => {
				const response = await client.api.transactions.$get({ query });

				const data = await response.json();
				const transactions = [
					...data.transactions.map((v) => ({
						...v,
						date: new Date(v.date),
						amount: convertAmountFromMiliunits(v.amount)
					}))
				];

				return {
					transactions
				};
			},
			initialData: {
				transactions: []
			},
			staleTime: transactionsFromSSR ? 1000 : 0
		}))
	);

	return query;
}
