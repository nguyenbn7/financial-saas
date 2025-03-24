import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';

export default function getAccountOptions() {
	const query = createQuery({
		queryKey: ['get_account_options'],
		queryFn: async () => {
			const response = await client.api.accounts.options.$get();

			return response.json();
		}
	});

	return query;
}
