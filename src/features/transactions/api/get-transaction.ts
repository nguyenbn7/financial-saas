import type { InferResponseType } from 'hono';
import type { ResponseError } from '$lib/error';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';
import { ClientError } from '$lib/error';

type Response = InferResponseType<(typeof client.api.transactions)[':id']['$get'], 200>;

export type Transaction = Omit<Response['transaction'], 'date'> & { date: Date };

interface Params {
	id: string;
}

export default function createGetTransactionClient(params: Params) {
	const { id } = params;

	const query = createQuery<{ transaction: Transaction }, ClientError>({
		queryKey: ['get', 'transaction', id],
		queryFn: async () => {
			const response = await client.api.transactions[':id']['$get']({ param: { id } });

			if (!response.ok) {
				const data = (await response.json()) as unknown as ResponseError;
				throw new ClientError(data.error.message, response.status);
			}
			const { transaction } = await response.json();
			return {
				transaction: {
					...transaction,
					date: new Date(transaction.date)
				}
			};
		}
	});

	return query;
}
