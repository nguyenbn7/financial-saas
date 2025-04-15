import type { Expression, SqlBool } from 'kysely';
import { db } from '$lib/server/db';

export async function getTransactions(conditions: {
	userId: number;
	startDate: Date;
	endDate: Date;
	accountId?: number;
}) {
	const { accountId, startDate, endDate, userId } = conditions;

	return db
		.selectFrom('transaction as t')
		.innerJoin('account as a', 'a.id', 't.account_id')
		.leftJoin('category as c', 'c.id', 't.category_id')
		.where((eb) => {
			const filters: Expression<SqlBool>[] = [];

			if (accountId !== undefined) filters.push(eb('t.account_id', '=', accountId));

			filters.push(eb('a.user_id', '=', userId));

			filters.push(eb('t.date', '>=', startDate));

			filters.push(eb('t.date', '<=', endDate));

			return eb.and(filters);
		})
		.orderBy('t.date', 'desc')
		.select([
			't.id',
			't.date',
			'c.name as category',
			't.category_id as categoryId',
			't.payee',
			't.amount',
			't.notes',
			'a.name as account',
			't.account_id as accountId'
		])
		.execute();
}

export async function getTransaction(conditions: { id: number; userId: number }) {
	const { id, userId } = conditions;

	return db
		.selectFrom('transaction as t')
		.innerJoin('account as a', 'a.id', 't.account_id')
		.where((eb) => {
			const filters: Expression<SqlBool>[] = [];

			filters.push(eb('t.id', '=', id));
			filters.push(eb('a.user_id', '=', userId));

			return eb.and(filters);
		})
		.select([
			't.id',
			't.date',
			't.category_id as categoryId',
			't.payee',
			't.amount',
			't.notes',
			't.account_id as accountId'
		])
		.execute();
}

export async function createTransaction(data: {
	amount: number;
	payee: string;
	accountId: number;
	date: Date;
	categoryId?: number;
	notes?: string;
}) {
	const { amount, payee, accountId: account_id, date, categoryId, notes } = data;

	return db
		.insertInto('transaction')
		.values({
			amount,
			account_id,
			payee,
			date,
			category_id: categoryId ?? null,
			notes: notes ?? null
		})
		.returning([
			'id',
			'amount',
			'payee',
			'account_id as accountId',
			'date',
			'category_id as categoryId',
			'notes'
		])
		.executeTakeFirst();
}

export async function deleteTransactions(conditions: { ids: number[]; userId: number }) {
	const { ids, userId } = conditions;

	const transactionsToDelete = await db
		.with('transactions_to_delete', (db) =>
			db
				.selectFrom('transaction as t')
				.innerJoin('account as a', 'a.id', 't.account_id')
				.where('t.id', 'in', ids)
				.where('a.user_id', '=', userId)
				.select('t.id')
		)
		.selectFrom('transactions_to_delete')
		.select('id')
		.execute();

	return db
		.deleteFrom('transaction as t')
		.where(
			't.id',
			'in',
			transactionsToDelete.map((v) => v.id)
		)
		.returning('id')
		.execute();
}

export async function updateTransaction(
	conditions: { id: number; userId: number },
	data: {
		amount: number;
		payee: string;
		accountId: number;
		date: Date;
		categoryId?: number;
		notes?: string;
	}
) {
	const { id, userId } = conditions;
	const { amount, payee, accountId, date, categoryId, notes } = data;

	const transactionToUpdate = await db
		.with('transactions_to_update', (db) =>
			db
				.selectFrom('transaction as t')
				.innerJoin('account as a', 'a.id', 't.account_id')
				.where('t.id', '=', id)
				.where('a.user_id', '=', userId)
				.select('t.id')
		)
		.selectFrom('transactions_to_update')
		.select('id')
		.executeTakeFirst();

	if (!transactionToUpdate) return;

	return db
		.updateTable('transaction')
		.set({
			amount,
			payee,
			account_id: accountId,
			date,
			category_id: categoryId ?? null,
			notes: notes ?? null
		})
		.returning('id')
		.executeTakeFirst();
}
