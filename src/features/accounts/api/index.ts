import type { client } from '$lib/rpc';
import type { InferResponseType } from 'hono';

export type AccountOptions = InferResponseType<typeof client.api.accounts.options.$get>;

export { default as deleteAccounts } from './delete-accounts';
export { default as getAccountOptions } from './get-account-options';
