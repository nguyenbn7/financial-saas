import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

import { account } from '$lib/db.schemas';

export const accountFormSchema = createInsertSchema(account, {
	name: z.string().trim().min(1, { message: 'name is not empty or contains spaces' })
}).omit({ userId: true });

export const deletesSchema = z.object({
	ids: z.number().array()
});
