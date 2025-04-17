import { and, eq, inArray } from 'drizzle-orm';
import db from '$lib/server/database';
import { categoryTable } from '$lib/server/database/schema';

export async function createCategory(data: { userId: string; name: string }) {
	const { userId, name } = data;

	return db
		.insert(categoryTable)
		.values({
			name,
			userId
		})
		.execute();
}

export async function updateCategory(
	searchParams: { id: string; userId: string },
	data: { name: string }
) {
	const { id, userId } = searchParams;
	const { name } = data;

	return db
		.update(categoryTable)
		.set({ name })
		.where(and(eq(categoryTable.id, id), eq(categoryTable.userId, userId)))
		.execute();
}

export async function deleteCategories(searchParams: { ids: string[]; userId: string }) {
	const { ids, userId } = searchParams;

	return db
		.delete(categoryTable)
		.where(and(inArray(categoryTable.id, ids), eq(categoryTable.userId, userId)))
		.returning({ id: categoryTable.id });
}

export async function getCategories(searchParams: { userId: string }) {
	const { userId } = searchParams;

	return db.select().from(categoryTable).where(eq(categoryTable.userId, userId));
}
