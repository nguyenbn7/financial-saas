import { z } from 'zod';

export const transactionFormSchema = z.object({
	id: z.string().optional(),
	date: z.coerce.date(),
	accountId: z.string().min(1, 'Required'),
	categoryId: z.string().nullable().default(null),
	payee: z.string().trim().min(1, 'Required'),
	amount: z.number().refine((v) => v !== 0, { message: 'Cannot be 0' }),
	notes: z.string().nullable().default(null)
});

export const querySchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	accountId: z.string().optional()
});

export const deletesSchema = z.object({
	ids: z.string().array()
});
