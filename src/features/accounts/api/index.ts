import type { client } from '$lib/rpc';
import type { InferResponseType } from 'hono';

export type AccountOptions = InferResponseType<typeof client.api.accounts.options.$get>;

export { default as deleteAccounts } from './delete-accounts';
export { default as useGetAccountOptions } from './use-get-account-options';
export { default as useCreateAccount } from './use-create-account';
