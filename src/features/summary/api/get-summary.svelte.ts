import type { InferResponseType } from 'hono';
import { page } from '$app/state';
import { client } from '$lib/rpc';
import { createQuery } from '@tanstack/svelte-query';
import { convertAmountFromMiliunits } from '$lib';

type Response = Omit<InferResponseType<typeof client.api.summary.$get>, 'days'> & {
	days: { income: number; expense: number; date: Date }[];
};

export default function createGetSummaryClient() {
	const searchParams = $derived({
		accountId: page.params['accountId'] ?? undefined,
		from: page.params['from'] ?? undefined,
		to: page.params['to'] ?? undefined
	});

	const query = createQuery<Response, Error>({
		// TODO:
		queryKey: ['get', 'summary'],
		queryFn: async () => {
			const response = await client.api.summary.$get({ query: searchParams });

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
		}
	});

	return query;
}
