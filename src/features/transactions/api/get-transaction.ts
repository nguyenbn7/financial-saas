import type { InferResponseType } from 'hono';

import { convertAmountFromMiliunits } from '$lib';
import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

import { createQuery, useQueryClient } from '@tanstack/svelte-query';

import { derived, writable } from 'svelte/store';

type ErrorResponse = Extract<
	InferResponseType<(typeof client.api.transactions)[':id']['$get']>,
	{ status: number }
>;

type Response = InferResponseType<(typeof client.api.transactions)[':id']['$get'], 200>;

export type Transaction = Omit<Response['transaction'], 'date'> & { date: Date };

interface SSR {
	transaction?: Transaction;
}

const emptyTransaction: Transaction = {
	id: '',
	accountId: '',
	amount: 0,
	categoryId: '',
	notes: null,
	payee: '',
	date: new Date()
};

const transactionId = writable<string | undefined>(undefined);

export function useTransactionId() {
	return {
		subscribe: transactionId.subscribe,
		set: (id: string | undefined) => transactionId.set(id)
	};
}

export default function useGetTransaction(ssr: SSR = { transaction: undefined }) {
	const { transaction } = ssr;

	const queryClient = useQueryClient();

	if (transaction) {
		transactionId.set(transaction.id);
		queryClient.setQueryData(['get', 'transaction', transaction.id], () => ({
			transaction
		}));
	}

	const query = createQuery<{ transaction: Transaction }, ClientError>(
		derived(transactionId, (id) => ({
			queryKey: ['get', 'transaction', id],
			queryFn: async () => {
				if (!id) {
					return {
						transaction: emptyTransaction
					};
				}

				const response = await client.api.transactions[':id']['$get']({ param: { id } });

				if (!response.ok) {
					const { title, detail, status } = (await response.json()) as ErrorResponse;
					throw new ClientError({ title, detail, status });
				}

				const { transaction } = await response.json();

				return {
					transaction: {
						...transaction,
						amount: convertAmountFromMiliunits(transaction.amount),
						date: new Date(transaction.date)
					}
				};
			}
		}))
	);

	return query;
}
