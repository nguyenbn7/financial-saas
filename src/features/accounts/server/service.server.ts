import { db } from '$lib/server/db';

export async function getPageAccount(
	userId: number,
	page: number = 1,
	pageSize: number = 5,
	orders: string[] = []
) {
	page = page < 1 ? 1 : page;
	pageSize = pageSize < 1 ? 5 : pageSize;
	orders = orders.length > 0 ? orders : [''];

	let query = db.selectFrom('account').where('user_id', '=', userId);

	for (const field of orders) {
		const normalizedField = field.toLowerCase();
		switch (normalizedField) {
			case '-name':
				query = query.orderBy('name desc');
				break;
			default:
				query = query.orderBy('name');
		}
	}

	const totalRecords =
		(
			await query
				.groupBy(['id', 'name'])
				.select(db.fn.count<number>('id').as('count'))
				.executeTakeFirst()
		)?.count ?? 0;

	const data = await query
		.offset(page * pageSize - pageSize)
		.limit(pageSize)
		.select(['id', 'name'])
		.execute();

	return {
		page,
		pageSize,
		totalRecords,
		data
	};
}

export async function deleteAccounts(userId: number, data: { ids: number[] }) {
	return db
		.deleteFrom('account')
		.where('user_id', '=', userId)
		.where('id', 'in', data.ids)
		.execute();
}

export async function updateAccount(userId: number, data: { id: number; name: string }) {
	return db
		.updateTable('account')
		.set({ name: data.name })
		.where('user_id', '=', userId)
		.where('id', '=', data.id)
		.execute();
}

export async function createAccount(userId: number, data: { name: string }) {
	return db
		.insertInto('account')
		.values({
			user_id: userId,
			name: data.name
		})
		.returning(['id', 'name'])
		.executeTakeFirst();
}

export async function getAccountOptions(userId: number) {
	return db.selectFrom('account').where('user_id', '=', userId).select(['id', 'name']).execute();
}
