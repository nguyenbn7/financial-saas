import db from '$lib/server/database';
import { accountTable, categoryTable, transactionTable } from '$lib/server/database/schema';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';

export async function getTransactions(searchParams: {
	accountId?: string;
	userId: string;
	startDate: Date;
	endDate: Date;
}) {
	const { accountId, startDate, endDate, userId } = searchParams;

	return db
		.select({
			id: transactionTable.id,
			date: transactionTable.date,
			category: categoryTable.name,
			categoryId: transactionTable.categoryId,
			payee: transactionTable.payee,
			amount: transactionTable.amount,
			notes: transactionTable.notes,
			account: accountTable.name,
			accountId: transactionTable.accountId
		})
		.from(transactionTable)
		.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
		.leftJoin(categoryTable, eq(transactionTable.categoryId, categoryTable.id))
		.where(
			and(
				accountId ? eq(transactionTable.accountId, accountId) : undefined,
				eq(accountTable.userId, userId),
				gte(transactionTable.date, startDate),
				lte(transactionTable.date, endDate)
			)
		)
		.orderBy(desc(transactionTable.date));
}

export async function getTransaction(searchParams: { id: string; userId: string }) {
	const { id, userId } = searchParams;

	return db
		.select({
			id: transactionTable.id,
			date: transactionTable.date,
			categoryId: transactionTable.categoryId,
			payee: transactionTable.payee,
			amount: transactionTable.amount,
			notes: transactionTable.notes,
			accountId: transactionTable.accountId
		})
		.from(transactionTable)
		.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
		.where(and(eq(transactionTable.id, id), eq(accountTable.userId, userId)));
}

export async function createTransaction(data: {
	amount: number;
	payee: string;
	accountId: string;
	date: Date;
	categoryId?: string | null;
	notes?: string | null;
}) {
	const { amount, payee, accountId, date, categoryId, notes } = data;

	return db
		.insert(transactionTable)
		.values({
			amount,
			accountId,
			payee,
			date,
			categoryId,
			notes
		})
		.returning();
}

export async function deleteTransactions(searchParams: { ids: string[]; userId: string }) {
	const { ids, userId } = searchParams;

	const transactionsToDelete = db.$with('transactions_to_delete').as(
		db
			.select({ id: transactionTable.id })
			.from(transactionTable)
			.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
			.where(and(inArray(transactionTable.id, ids), eq(accountTable.userId, userId)))
	);

	return db
		.with(transactionsToDelete)
		.delete(transactionTable)
		.where(inArray(transactionTable.id, sql`(select id from ${transactionsToDelete})`))
		.returning({ id: transactionTable.id });
}

export async function updateTransaction(
	searchParams: { id: string; userId: string },
	data: {
		amount: number;
		payee: string;
		accountId: string;
		date: Date;
		categoryId?: string | null;
		notes?: string | null;
	}
) {
	const { id, userId } = searchParams;
	const { amount, payee, accountId, date, categoryId, notes } = data;

	const transactionToUpdate = db.$with('transactions_to_update').as(
		db
			.select({ id: transactionTable.id })
			.from(transactionTable)
			.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
			.where(and(eq(transactionTable.id, id), eq(accountTable.userId, userId)))
	);

	return db
		.with(transactionToUpdate)
		.update(transactionTable)
		.set({
			amount,
			payee,
			accountId,
			date,
			categoryId,
			notes
		})
		.where(inArray(transactionTable.id, sql`(select id from ${transactionToUpdate})`))
		.returning();
}
