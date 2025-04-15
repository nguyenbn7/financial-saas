import { z } from 'zod';
import { transaction } from '$lib/db.schemas';
import { createInsertSchema } from 'drizzle-zod';

export const transactionFormSchema = createInsertSchema(transaction, {
	date: z.coerce.date(),
	accountId: z.coerce.number(),
	categoryId: z.coerce.number().optional(),
	payee: z.string(),
	amount: z.coerce.number(),
	notes: z.string().optional()
});

export const querySchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	accountId: z.string().optional()
});
