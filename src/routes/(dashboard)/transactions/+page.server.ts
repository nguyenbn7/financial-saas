import type { PageServerLoad } from './$types';
import type { Expression, SqlBool } from 'kysely';

import { parse, subDays } from 'date-fns';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { db } from '$lib/server/db';

import { querySchema } from '$features/transactions/schemas';
import { insertTransactionSchema } from '$features/transactions/schemas';

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

	const data = await db
		.selectFrom('transaction as t')
		.innerJoin('account as a', 'a.id', 't.account_id')
		.leftJoin('category as c', 'c.id', 't.category_id')
		.where((eb) => {
			const filters: Expression<SqlBool>[] = [];

			if (accountId) filters.push(eb('t.account_id', '=', Number(accountId)));

			filters.push(eb('a.user_id', '=', user.id));

			filters.push(eb('t.date', '>=', startDate));

			filters.push(eb('t.date', '<=', endDate));

			return eb.and(filters);
		})
		.orderBy('t.date desc')
		.select([
			't.id',
			't.payee',
			't.amount',
			't.date',
			't.notes',
			'a.name as account',
			'c.name as category'
		])
		.execute();

	const createForm = await superValidate(zod(insertTransactionSchema));

	return { createForm, data };
}) satisfies PageServerLoad;
