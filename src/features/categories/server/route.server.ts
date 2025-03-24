import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { authenticate } from '$lib/server/middlewares';

import { deletesSchema } from '../schemas';
import { deleteCategories, getCategoryOptions, getPageCategory } from './service.server';

import { delay } from '$lib';

const { DEV } = import.meta.env;

const app = new Hono()
	.get('/options', authenticate, async (c) => {
		if (DEV) await delay(0.5, 1);

		const user = c.get('user');

		return c.json(await getCategoryOptions(user.id));
	})
	.delete('/', authenticate, zValidator('json', deletesSchema), async (c) => {
		if (DEV) await delay(1, 2);

		const user = c.get('user');
		const { ids } = c.req.valid('json');

		await deleteCategories(user.id, { ids });

		return c.json({ pagination: await getPageCategory(user.id) });
	});

export default app;
