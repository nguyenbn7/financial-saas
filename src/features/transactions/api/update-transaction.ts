import type { InferRequestType, InferResponseType } from 'hono';

import { convertAmountFromMiliunits, convertAmountToMiliunits } from '$lib';
import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

import { goto } from '$app/navigation';

import { createMutation, useQueryClient } from '@tanstack/svelte-query';

import { toast } from 'svelte-sonner';

type ErrorResponse = Extract<
	InferResponseType<(typeof client.api.transactions)[':id']['$put']>,
	{ status: number }
>;

type Response = InferResponseType<(typeof client.api.transactions)[':id']['$put'], 200>;

type Request = InferRequestType<(typeof client.api.transactions)[':id']['$put']>;

interface Options {
	onSuccess?: (data: Response, variables: Request, context: unknown) => Promise<unknown> | unknown;
	onError?: (
		error: ClientError,
		variables: Request,
		context: unknown
	) => Promise<unknown> | unknown;
}

export default function useUpdateTransaction(options: Options = {}) {
	const { onSuccess, onError } = options;

	const queryClient = useQueryClient();

	const mutation = createMutation<Response, ClientError, Request>({
		mutationKey: ['update', 'transaction'],
		mutationFn: async ({ param, json }) => {
			const response = await client.api.transactions[':id'].$put({
				param,
				json: { ...json, amount: convertAmountToMiliunits(json.amount) }
			});

			if (!response.ok) {
				const { title, detail, status } = (await response.json()) as ErrorResponse;
				throw new ClientError({ title, detail, status });
			}

			const { transaction } = await response.json();

			return {
				transaction: { ...transaction, amount: convertAmountFromMiliunits(transaction.amount) }
			};
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
			await queryClient.invalidateQueries({ queryKey: ['get', 'transactions'] });
			await queryClient.invalidateQueries({ queryKey: ['get', 'summary'] });

			toast.success('Transaction updated');

			return onSuccess?.(data, variables, context);
		}
	});

	return mutation;
}
