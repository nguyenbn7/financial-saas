import type { InferRequestType, InferResponseType } from 'hono';

import { createMutation } from '@tanstack/svelte-query';

import { client } from '$lib/rpc';
import { ClientError } from '$lib';

type Response = InferResponseType<typeof client.api.transactions.$delete>;
type Request = InferRequestType<typeof client.api.transactions.$delete>;

export default function createDeleteTransactionsClient() {
	const mutation = createMutation<Response, ClientError, Request>({
		mutationKey: ['delete', 'transactions'],
		mutationFn: async ({ json, query }) => {
			const response = await client.api.transactions.$delete({ json, query });

			if (!response.ok) {
				const data = (await response.json()) as unknown as { error: string };
				throw new ClientError(data.error, response.status);
			}

			return response.json();
		}
	});

	return mutation;
}
