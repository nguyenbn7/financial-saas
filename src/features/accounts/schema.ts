import { z } from 'zod';

export const accountSchema = z.object({
	name: z.string().trim().min(1, 'Required')
});

export const accountIdSchema = z.object({
	id: z.string().trim().min(1, 'Required')
});

export const deleteAccountsSchema = z.object({
	ids: z.string().array().min(1)
});
