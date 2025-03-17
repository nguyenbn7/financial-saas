import { z } from 'zod';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { category } from '$lib/db.schemas';

export const insertCategorySchema = createInsertSchema(category, {
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
}).omit({ userId: true });

export const updateCategorySchema = createUpdateSchema(category, {
	id: z.coerce.number(),
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
}).omit({ userId: true });

export const deleteCategoriesSchema = z.object({
	ids: z.number().array()
});
