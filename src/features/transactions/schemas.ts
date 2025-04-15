import { z } from 'zod';
import { transaction } from '$lib/db.schemas';
import { createInsertSchema } from 'drizzle-zod';

export const transactionFormSchema = createInsertSchema(transaction, {
	date: z.coerce.date(),
	accountId: z.number().min(1, 'Required'),
	categoryId: z.number().optional(),
	payee: z.string().min(1, 'Required'),
	amount: z.number().min(1, 'Cannot be 0'),
	notes: z.string().optional()
});

export const querySchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	accountId: z.string().optional()
});
