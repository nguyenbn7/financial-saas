import { page } from '$app/state';
import { writable } from 'svelte/store';

type SearchParams = {
	accountId?: string | undefined;
	from?: string | undefined;
	to?: string | undefined;
};

export function useSearchParams() {
	const searchParams = writable<SearchParams>({});

	$effect(() => {
		const { searchParams: pageSearchParams } = page.url;

		searchParams.set({
			accountId: pageSearchParams.get('accountId') ?? undefined,
			from: pageSearchParams.get('from') ?? undefined,
			to: pageSearchParams.get('to') ?? undefined
		});
	});

	return searchParams;
}
