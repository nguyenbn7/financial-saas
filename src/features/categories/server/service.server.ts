import { db } from '$lib/server/db';

export async function getPageCategory(
	userId: number,
	page: number = 1,
	pageSize: number = 5,
	orders: string[] = []
) {
	page = page < 1 ? 1 : page;
	pageSize = pageSize < 1 ? 5 : pageSize;
	orders = orders.length > 0 ? orders : [''];

	let query = db.selectFrom('category').where('user_id', '=', userId);

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

export async function createCategory(userId: number, data: { name: string }) {
	return db
		.insertInto('category')
		.values({
			user_id: userId,
			name: data.name
		})
		.execute();
}

export async function updateCategory(userId: number, data: { id: number; name: string }) {
	return db
		.updateTable('category')
		.set({ name: data.name })
		.where('user_id', '=', userId)
		.where('id', '=', data.id)
		.execute();
}

export async function deleteCategories(userId: number, data: { ids: number[] }) {
	return db
		.deleteFrom('category')
		.where('user_id', '=', userId)
		.where('id', 'in', data.ids)
		.execute();
}

export async function getCategoryOptions(userId: number) {
	return db.selectFrom('category').where('user_id', '=', userId).select(['id', 'name']).execute();
}
