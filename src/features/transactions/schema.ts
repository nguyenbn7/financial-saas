import { z } from 'zod';

export const transactionSchema = z.object({
	date: z.coerce.date(),
	accountId: z.string().min(1, 'Required'),
	categoryId: z.string().nullable().default(null),
	payee: z.string().trim().min(1, 'Required'),
	amount: z.number().refine((v) => v !== 0, { message: 'Cannot be 0' }),
	notes: z.string().nullable().default(null)
});

export const bulkCreateTransactionSchema = z.array(transactionSchema);

export const querySchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	accountId: z.string().optional()
});

export const transactionIdSchema = z.object({
	id: z.string().trim().min(1, 'Required')
});

export const deleteTransactionsSchema = z.object({
	ids: z.string().array()
});
