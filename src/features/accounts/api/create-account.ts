import type { InferRequestType, InferResponseType } from 'hono';
import type { ResponseError } from '$lib/error';
import { goto } from '$app/navigation';
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';
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

	const queryClient = useQueryClient();

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
		async onError(error, variables, context) {
			const { message, status } = error;

			await onError?.(error, variables, context);

			toast.error(message);

			if (status === 401) {
				return goto('/sign-in', { invalidateAll: true });
			}
		},
		async onSuccess(data, variables, context) {
			await queryClient.invalidateQueries({ queryKey: ['get', 'accounts'] });
			await queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });

			toast.success('Account created');

			return onSuccess?.(data, variables, context);
		}
	});

	return mutation;
}
