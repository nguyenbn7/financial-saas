import type { PageServerLoad } from './$types';

import { querySchema, transactionSchema } from '$features/transactions/schema';
import { getTransactions } from '$features/transactions/server/repository';

import { convertAmountFromMiliunits } from '$lib';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { parse, subDays } from 'date-fns';

export const load = (async ({ parent, url }) => {
	const { userId } = await parent();

	const query = url.searchParams
		.entries()
		.reduce((prev, curr) => Object.assign(prev, { [curr[0]]: curr[1] }), {}) as {
		[x: string]: string;
	};

	const result = await querySchema.safeParseAsync(query);

	const { from, to, accountId } = result.data ?? {
		from: undefined,
		to: undefined,
		accountId: undefined
	};

	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
	const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

	const transactions = await getTransactions({
		userId,
		accountId,
		startDate,
		endDate
	});

	const form = await superValidate(zod(transactionSchema));

	return {
		form,
		transactions: transactions.map((t) => ({ ...t, amount: convertAmountFromMiliunits(t.amount) }))
	};
}) satisfies PageServerLoad;
