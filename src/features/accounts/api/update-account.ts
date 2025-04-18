import type { InferRequestType, InferResponseType } from 'hono';
import type { ResponseError } from '$lib/error';
import { createMutation } from '@tanstack/svelte-query';
import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

type Response = InferResponseType<(typeof client.api.accounts)[':id']['$put']>;
type Request = InferRequestType<(typeof client.api.accounts)[':id']['$put']>;

interface Options {
	onSuccess?: (data: Response, variables: Request, context: unknown) => Promise<unknown> | unknown;
	onError?: (
		error: ClientError,
		variables: Request,
		context: unknown
	) => Promise<unknown> | unknown;
}

export default function createUpdateAccountsClient(options: Options = {}) {
	const { onSuccess, onError } = options;

	const mutation = createMutation<Response, ClientError, Request>({
		mutationKey: ['put', 'account'],
		mutationFn: async ({ param, json }) => {
			const response = await client.api.accounts[':id'].$put({ param, json });

			if (!response.ok) {
				const data = (await response.json()) as unknown as ResponseError;
				throw new ClientError(data.error.message, response.status);
			}

			return response.json();
		},
		onError,
		onSuccess
	});

	return mutation;
}
