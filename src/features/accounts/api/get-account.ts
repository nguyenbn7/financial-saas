import type { InferResponseType } from 'hono';

import { client } from '$lib/rpc';
import { ClientError } from '$lib/error';

import { createQuery, useQueryClient } from '@tanstack/svelte-query';

import { derived, writable } from 'svelte/store';

type ErrorResponse = Extract<
	InferResponseType<(typeof client.api.accounts)[':id']['$get']>,
	{ status: number }
>;

type Response = InferResponseType<(typeof client.api.accounts)[':id']['$get'], 200>;

export type Account = Response['account'];

interface SSR {
	account?: Account;
}

const emptyAccount: Account = {
	id: '',
	name: '',
	userId: ''
};

const accountId = writable<string | undefined>(undefined);

export function useAccountId() {
	return {
		subscribe: accountId.subscribe,
		set: (id: string | undefined) => accountId.set(id)
	};
}

export default function useGetAccount(ssr: SSR = { account: undefined }) {
	const { account } = ssr;

	const queryClient = useQueryClient();

	if (account) {
		accountId.set(account.id);
		queryClient.setQueryData(['get', 'account', account.id], () => ({
			account
		}));
	}

	const query = createQuery<Response, ClientError>(
		derived(accountId, (id) => ({
			queryKey: ['get', 'account', id],
			queryFn: async () => {
				if (!id) {
					return {
						account: emptyAccount
					};
				}

				const response = await client.api.accounts[':id']['$get']({ param: { id } });

				if (!response.ok) {
					const { title, detail, status } = (await response.json()) as ErrorResponse;
					throw new ClientError({ title, detail, status });
				}

				return response.json();
			},
			staleTime: account || !id ? 1000 : 0
		}))
	);

	return query;
}
