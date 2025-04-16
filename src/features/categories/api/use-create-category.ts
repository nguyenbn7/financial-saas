import type { InferRequestType, InferResponseType } from 'hono';

import { createMutation } from '@tanstack/svelte-query';

import { client } from '$lib/rpc';
import { HttpError } from '$lib';

type Response = InferResponseType<typeof client.api.categories.$post>;
type Request = InferRequestType<typeof client.api.categories.$post>['json'];

type TData = Response;
type TError = HttpError;
type TContext = unknown;
type TVariables = Request;

interface Options {
	onSuccess?: (data: TData, variables: TVariables, context: TContext) => Promise<unknown> | unknown;
	onError?: (error: TError, variables: TVariables, context: TContext) => Promise<unknown> | unknown;
}

export default function useCreateCategory(options: Options = {}) {
	const { onSuccess, onError } = options;

	const mutation = createMutation<Response, HttpError, Request>({
		mutationKey: ['create_category'],
		mutationFn: async (json) => {
			const response = await client.api.categories.$post({ json });

			if (!response.ok) {
				const data = (await response.json()) as unknown as { error: string };
				throw new HttpError(data.error, response.status);
			}

			return response.json();
		},
		onSuccess,
		onError
	});

	return mutation;
}
