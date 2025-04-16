import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { category } from '$lib/server/database/schema';

export const categoryFormSchema = createInsertSchema(category, {
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
}).omit({ userId: true });

export const deletesSchema = z.object({
	ids: z.number().array()
});
