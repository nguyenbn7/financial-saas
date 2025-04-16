import { z } from 'zod';

export const categoryFormSchema = z.object({
	name: z.string().trim().min(1, 'Required')
});

export const deletesSchema = z.object({
	ids: z.number().array()
});
