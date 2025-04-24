import type { InferResponseType } from 'hono';
import { page } from '$app/state';
import { convertAmountFromMiliunits } from '$lib';
import { client } from '$lib/rpc';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

type Response = InferResponseType<typeof client.api.transactions.$get>;

type Transaction = Omit<ArrayElement<Response['transactions']>, 'date'> & { date: Date };

export type Transactions = Array<Transaction>;

interface SSR {
	transactions?: Transactions;
}

export default function createGetTransactionsClient(ssr: SSR = { transactions: undefined }) {
	const { transactions } = ssr;

	const queryClient = useQueryClient();

	const searchParams = $derived({
		accountId: page.params['accountId'] ?? undefined,
		from: page.params['from'] ?? undefined,
		to: page.params['to'] ?? undefined
	});

	if (transactions) {
		queryClient.setQueryData(['get', 'transactions'], () => ({
			transactions: [...transactions]
		}));
	}

	const query = createQuery<{ transactions: Transactions }, Error>({
		// TODO:
		queryKey: ['get', 'transactions'],
		queryFn: async () => {
			const response = await client.api.transactions.$get({ query: searchParams });

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
		}
	});

	return query;
}
