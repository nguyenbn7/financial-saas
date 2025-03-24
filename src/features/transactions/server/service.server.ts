import type { Expression, SqlBool } from 'kysely';

import { db } from '$lib/server/db';

export async function getTransactions(
	userId: number,
	data: { accountId: number; startDate: Date; endDate: Date }
) {
	const { accountId, startDate, endDate } = data;

	return db
		.selectFrom('transaction as t')
		.innerJoin('account as a', 'a.id', 't.account_id')
		.leftJoin('category as c', 'c.id', 't.category_id')
		.where((eb) => {
			const filters: Expression<SqlBool>[] = [];

			if (accountId) filters.push(eb('t.account_id', '=', Number(accountId)));

			filters.push(eb('a.user_id', '=', userId));

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
}
