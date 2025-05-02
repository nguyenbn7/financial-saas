import db from '$lib/server/database';

import { accountTable } from '$lib/server/database/schema';

import { and, asc, count, desc, eq, inArray } from 'drizzle-orm';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE = 1;

export async function getAccountPage(searchParams: {
	userId: string;
	page: number;
	pageSize: number;
	orders: string[];
}) {
	const { userId } = searchParams;
	let { page, pageSize, orders } = searchParams;

	page = page < 1 ? DEFAULT_PAGE : page;
	pageSize = pageSize < 1 ? DEFAULT_PAGE_SIZE : pageSize;
	orders = orders.length > 0 ? orders : [''];

	const totalRecords = await db
		.select({ count: count() })
		.from(accountTable)
		.where(eq(accountTable.userId, userId));

	const orderFields = orders.map((field) => {
		const normalizedField = field.toLowerCase();

		switch (normalizedField) {
			case '-name':
				return desc(accountTable.name);
			default:
				return asc(accountTable.name);
		}
	});

	const data = await db
		.select()
		.from(accountTable)
		.where(eq(accountTable.userId, userId))
		.orderBy(...orderFields)
		.offset(page * pageSize - pageSize)
		.limit(pageSize);

	return {
		page,
		pageSize,
		totalRecords,
		data
	};
}

export async function getAccounts(searchParams: { userId: string }) {
	const { userId } = searchParams;

	return db.select().from(accountTable).where(eq(accountTable.userId, userId));
}

export async function getAccount(searchParams: { id: string; userId: string }) {
	const { id, userId } = searchParams;

	return db
		.select()
		.from(accountTable)
		.where(and(eq(accountTable.id, id), eq(accountTable.userId, userId)));
}

export async function deleteAccounts(searchParams: { ids: string[]; userId: string }) {
	const { ids, userId } = searchParams;

	return db
		.delete(accountTable)
		.where(and(inArray(accountTable.id, ids), eq(accountTable.userId, userId)))
		.returning({ id: accountTable.id });
}

export async function updateAccount(
	searchParams: { id: string; userId: string },
	data: { name: string }
) {
	const { id, userId } = searchParams;
	const { name } = data;
	return db
		.update(accountTable)
		.set({
			name
		})
		.where(and(eq(accountTable.id, id), eq(accountTable.userId, userId)))
		.returning();
}

export async function createAccount(data: { userId: string; name: string }) {
	const { userId, name } = data;

	return db
		.insert(accountTable)
		.values({
			name,
			userId
		})
		.returning();
}
