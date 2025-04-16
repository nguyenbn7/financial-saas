import type { InferRequestType, InferResponseType } from 'hono';
import type { ResponseError } from '$lib/error';
import { createMutation } from '@tanstack/svelte-query';
import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

type Response = InferResponseType<typeof client.api.accounts.$post, 200>;
type Request = InferRequestType<typeof client.api.accounts.$post>['json'];

interface Options {
	onSuccess?: (data: Response, variables: Request, context: unknown) => Promise<unknown> | unknown;
	onError?: (
		error: ClientError,
		variables: Request,
		context: unknown
	) => Promise<unknown> | unknown;
}

export default function createCreateAccountClient(options: Options = {}) {
	const { onSuccess, onError } = options;

	const mutation = createMutation<Response, ClientError, Request>({
		mutationKey: ['create', 'account'],
		mutationFn: async (json) => {
			const response = await client.api.accounts.$post({ json });

			if (!response.ok) {
				const data = (await response.json()) as unknown as ResponseError;
				throw new ClientError(data.error.message, response.status);
			}

			return response.json();
		},
		onSuccess,
		onError
	});

	return mutation;
}
