import type { InferResponseType } from 'hono';
import { derived } from 'svelte/store';
import { createQuery } from '@tanstack/svelte-query';
import { useSearchParams } from '$lib/hooks.svelte';
import { convertAmountFromMiliunits } from '$lib';
import { client } from '$lib/rpc';

type Response = Omit<InferResponseType<typeof client.api.summary.$get>, 'days'> & {
	days: { income: number; expense: number; date: Date }[];
};

export default function createGetSummaryClient() {
	const searchParams = useSearchParams();

	const query = createQuery<Response, Error>(
		derived(searchParams, (query) => ({
			queryKey: ['get', 'summary', query],
			queryFn: async () => {
				const response = await client.api.summary.$get({ query });

				const data = await response.json();

				const {
					remainingAmount,
					remainingChange,
					incomeAmount,
					incomeChange,
					expenseAmount,
					expenseChange,
					categories,
					days
				} = data;

				return {
					remainingAmount: convertAmountFromMiliunits(remainingAmount),
					remainingChange: convertAmountFromMiliunits(remainingChange),
					incomeAmount: convertAmountFromMiliunits(incomeAmount),
					incomeChange: convertAmountFromMiliunits(incomeChange),
					expenseAmount: convertAmountFromMiliunits(expenseAmount),
					expenseChange: convertAmountFromMiliunits(expenseChange),
					categories: categories.map((category) => ({
						...category,
						value: convertAmountFromMiliunits(category.value)
					})),
					days: days.map((day) => ({
						income: convertAmountFromMiliunits(day.income),
						expense: convertAmountFromMiliunits(day.expense),
						date: new Date(day.date)
					}))
				};
			},
			staleTime: 0
		}))
	);

	return query;
}
