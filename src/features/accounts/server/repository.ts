import db from '$lib/server/database';
import { accountTable } from '$lib/server/database/schema';
import { and, asc, count, desc, eq, inArray } from 'drizzle-orm';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE = 1;

export async function getAccountPage(
	conditions: { userId: string },
	pageable: { page: number; pageSize: number; orders: string[] } = {
		page: DEFAULT_PAGE,
		pageSize: DEFAULT_PAGE_SIZE,
		orders: ['']
	}
) {
	const { userId } = conditions;

	let { page, pageSize, orders } = pageable;

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

export async function getAccounts(conditions: { userId: string }) {
	const { userId } = conditions;

	return db.select().from(accountTable).where(eq(accountTable.userId, userId));
}

export async function deleteAccounts(conditions: { ids: string[]; userId: string }) {
	const { ids, userId } = conditions;

	return db
		.delete(accountTable)
		.where(and(inArray(accountTable.id, ids), eq(accountTable.userId, userId)))
		.returning({ id: accountTable.id });
}

export async function updateAccount(
	conditions: { id: string; userId: string },
	data: { name: string }
) {
	const { id, userId } = conditions;
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
