import { z } from 'zod';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';

import { account } from '$lib/db.schemas';

export const insertAccountSchema = createInsertSchema(account, {
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
}).omit({ userId: true });

export const updateAccountSchema = createUpdateSchema(account, {
	id: z.coerce.number(),
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
}).omit({ userId: true });

export const deleteAccountsSchema = z.object({
	ids: z.number().array()
});
