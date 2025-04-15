import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { authenticate } from '$lib/server/middlewares';

import { categoryFormSchema, deletesSchema } from '../schemas';
import {
	createCategory,
	deleteCategories,
	getCategoryOptions,
	getPageCategory
} from './service.server';

import { delay } from '$lib';

const { DEV } = import.meta.env;

const app = new Hono()
	.get('/options', authenticate, async (c) => {
		const user = c.get('user');

		return c.json(await getCategoryOptions(user.id));
	})
	.post('/', authenticate, zValidator('json', categoryFormSchema.omit({ id: true })), async (c) => {
		const user = c.get('user');
		const { name } = c.req.valid('json');

		const newCategory = await createCategory(user.id, { name });

		return c.json({ data: newCategory });
	})
	.delete('/', authenticate, zValidator('json', deletesSchema), async (c) => {
		const user = c.get('user');
		const { ids } = c.req.valid('json');

		await deleteCategories(user.id, { ids });

		return c.json({ pagination: await getPageCategory(user.id) });
	});

export default app;
