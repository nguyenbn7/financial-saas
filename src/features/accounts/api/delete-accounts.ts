import type { InferRequestType, InferResponseType } from 'hono';

import { createMutation } from '@tanstack/svelte-query';

import { client } from '$lib/rpc';
import { ClientError } from '$lib';

type Response = InferResponseType<typeof client.api.accounts.$delete>;
type Request = InferRequestType<typeof client.api.accounts.$delete>['json'];

export default function deleteAccounts() {
	const mutation = createMutation<Response, ClientError, Request>({
		mutationKey: ['delete_accounts'],
		mutationFn: async (json) => {
			const response = await client.api.accounts.$delete({ json });

			if (!response.ok) {
				const data = (await response.json()) as unknown as { error: string };
				throw new ClientError(data.error, response.status);
			}

			return response.json();
		}
	});

	return mutation;
}
