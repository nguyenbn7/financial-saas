import type { InferResponseType } from 'hono';
import type { ResponseError } from '$lib/error';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';
import { ClientError } from '$lib/error';

type Response = InferResponseType<(typeof client.api.accounts)[':id']['$get'], 200>;

export type Account = Response['account'];

interface Params {
	id: string;
}

export default function createGetAccountClient(params: Params) {
	const { id } = params;

	const query = createQuery<Response, ClientError>({
		queryKey: ['get', 'account', id],
		queryFn: async () => {
			const response = await client.api.accounts[':id']['$get']({ param: { id } });

			if (!response.ok) {
				const data = (await response.json()) as unknown as ResponseError;
				throw new ClientError(data.error.message, response.status);
			}

			return response.json();
		}
	});

	return query;
}
