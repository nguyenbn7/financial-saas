import { z } from 'zod';
import { transaction } from '$lib/server/database/schema';
import { createInsertSchema } from 'drizzle-zod';

export const transactionFormSchema = createInsertSchema(transaction, {
	date: z.coerce.date(),
	accountId: z.number().min(1, 'Required'),
	categoryId: z.number().nullable().default(null),
	payee: z.string().min(1, 'Required'),
	amount: z.number().refine((v) => v !== 0, { message: 'Cannot be 0' }),
	notes: z.string().nullable().default(null)
});

export const querySchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	accountId: z.string().optional()
});

export const deletesSchema = z.object({
	ids: z.number().array()
});
