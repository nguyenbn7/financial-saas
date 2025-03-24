import type { PageServerLoad } from './$types';

import { parse, subDays } from 'date-fns';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { querySchema, transactionFormSchema } from '$features/transactions/schemas';
import { getTransactions } from '$features/transactions/server/service.server';

export const load = (async ({ parent, url }) => {
	const { user } = await parent();

	const query = url.searchParams
		.entries()
		.reduce((prev, curr) => Object.assign(prev, { [curr[0]]: curr[1] }), {}) as {
		[x: string]: string;
	};

	const result = await querySchema.parseAsync(query);

	const { from, to, accountId } = result;

	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
	const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

	const data = await getTransactions(user.id, { accountId: Number(accountId), startDate, endDate });

	const form = await superValidate(zod(transactionFormSchema));

	return { form, data };
}) satisfies PageServerLoad;
