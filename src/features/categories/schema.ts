import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string().trim().min(1, 'Required')
});

export const categoryIdSchema = z.object({
	id: z.string().trim().min(1, 'Required')
});

export const deleteCategoriesSchema = z.object({
	ids: z.string().array().min(1)
});
