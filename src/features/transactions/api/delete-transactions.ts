import type { InferRequestType, InferResponseType } from 'hono';
import type { ResponseError } from '$lib/error';
import { goto } from '$app/navigation';
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';
import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

type Response = InferResponseType<typeof client.api.transactions.$delete>;
type Request = InferRequestType<typeof client.api.transactions.$delete>['json'];

interface Options {
	onSuccess?: (data: Response, variables: Request, context: unknown) => Promise<unknown> | unknown;
	onError?: (
		error: ClientError,
		variables: Request,
		context: unknown
	) => Promise<unknown> | unknown;
}

export default function createDeleteTransactionsClient(options: Options = {}) {
	const { onSuccess, onError } = options;

	const queryClient = useQueryClient();

	const mutation = createMutation<Response, ClientError, Request>({
		mutationKey: ['delete', 'transactions'],
		mutationFn: async (json) => {
			const response = await client.api.transactions.$delete({ json });

			if (!response.ok) {
				const data = (await response.json()) as unknown as ResponseError;
				throw new ClientError(data.error.message, response.status);
			}

			return response.json();
		},
		async onError(error, variables, context) {
			const { message, status } = error;

			await onError?.(error, variables, context);

			toast.error(message);

			if (status === 401) {
				return goto('/sign-in', { invalidateAll: true });
			}
		},
		async onSuccess(data, variables, context) {
			const { ids } = variables;

			await queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });

			if (ids.length === 1) {
				toast.success('Transaction deleted');
			} else if (ids.length > 1) {
				toast.success('Transactions deleted');
			}

			return onSuccess?.(data, variables, context);
		}
	});

	return mutation;
}
