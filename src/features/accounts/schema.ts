import { z } from 'zod';

export const accountFormSchema = z.object({
	id: z.string().min(1, 'Required'),
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
});

export const deletesSchema = z.object({
	ids: z.string().array()
});
