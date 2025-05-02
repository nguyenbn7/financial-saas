import db from '$lib/server/database';

import { accountTable, categoryTable, transactionTable } from '$lib/server/database/schema';

import { and, desc, eq, gte, lt, lte, sql, sum } from 'drizzle-orm';

export async function getFinancialData(query: {
	userId: string;
	startDate: Date;
	endDate: Date;
	accountId?: string;
}) {
	const { userId, startDate, endDate, accountId } = query;

	return db
		.select({
			income:
				sql`SUM(CASE WHEN ${transactionTable.amount} >= 0 THEN ${transactionTable.amount} ELSE 0 END)`.mapWith(
					Number
				),
			expense:
				sql`SUM(CASE WHEN ${transactionTable.amount} < 0 THEN ${transactionTable.amount} ELSE 0 END)`.mapWith(
					Number
				),
			remaining: sum(transactionTable.amount).mapWith(Number)
		})
		.from(transactionTable)
		.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
		.where(
			and(
				accountId ? eq(transactionTable.accountId, accountId) : undefined,
				eq(accountTable.userId, userId),
				gte(transactionTable.date, startDate),
				lte(transactionTable.date, endDate)
			)
		);
}

export async function getCategoriesByFinancialData(query: {
	userId: string;
	startDate: Date;
	endDate: Date;
	accountId?: string;
}) {
	const { userId, startDate, endDate, accountId } = query;

	return db
		.select({
			name: categoryTable.name,
			value: sql`SUM(ABS(${transactionTable.amount}))`.mapWith(Number)
		})
		.from(transactionTable)
		.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
		.innerJoin(categoryTable, eq(transactionTable.categoryId, categoryTable.id))
		.where(
			and(
				accountId ? eq(transactionTable.accountId, accountId) : undefined,
				eq(accountTable.userId, userId),
				lt(transactionTable.amount, 0),
				gte(transactionTable.date, startDate),
				lte(transactionTable.date, endDate)
			)
		)
		.groupBy(categoryTable.name)
		.orderBy(desc(sql`SUM(ABS(${transactionTable.amount}))`));
}

export async function getActiveDays(query: {
	userId: string;
	startDate: Date;
	endDate: Date;
	accountId?: string;
}) {
	const { userId, accountId, startDate, endDate } = query;

	return db
		.select({
			date: transactionTable.date,
			income:
				sql`SUM(CASE WHEN ${transactionTable.amount} >= 0 THEN ${transactionTable.amount} ELSE 0 END)`.mapWith(
					Number
				),
			expense:
				sql`SUM(CASE WHEN ${transactionTable.amount} < 0 THEN ABS(${transactionTable.amount}) ELSE 0 END)`.mapWith(
					Number
				)
		})
		.from(transactionTable)
		.innerJoin(accountTable, eq(transactionTable.accountId, accountTable.id))
		.where(
			and(
				accountId ? eq(transactionTable.accountId, accountId) : undefined,
				eq(accountTable.userId, userId),
				gte(transactionTable.date, startDate),
				lte(transactionTable.date, endDate)
			)
		)
		.groupBy(transactionTable.date)
		.orderBy(transactionTable.date);
}
