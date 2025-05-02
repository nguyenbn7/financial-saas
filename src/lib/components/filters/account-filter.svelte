<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import qs from 'query-string';

	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

	import { useGetAccounts } from '$features/accounts/api';

	const getAccountsClient = useGetAccounts();

	const accountId = $derived(page.url.searchParams.get('accountId') || 'all');
	const from = $derived(page.url.searchParams.get('from') || '');
	const to = $derived(page.url.searchParams.get('to') || '');

	const accounts = $derived($getAccountsClient.data.accounts);

	function onChange(newValue: string) {
		const query = {
			accountId: newValue,
			from,
			to
		};

		if (newValue === 'all') {
			query.accountId = '';
		}

		const { pathname } = page.url;

		const url = qs.stringifyUrl(
			{ url: pathname, query },
			{ skipNull: true, skipEmptyString: true }
		);

		goto(url, { replaceState: true, noScroll: true });
	}
</script>

<Select
	bind:value={() => accountId, (newValue) => onChange(newValue)}
	type="single"
	disabled={$getAccountsClient.isLoading}
>
	<SelectTrigger
		class="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
	>
		{accounts.find((a) => a.id.toString() === accountId)?.name ?? 'All accounts'}
	</SelectTrigger>

	<SelectContent>
		<SelectItem value="all">All accounts</SelectItem>

		{#each accounts as account}
			<SelectItem value={account.id}>
				{account.name}
			</SelectItem>
		{/each}
	</SelectContent>
</Select>
