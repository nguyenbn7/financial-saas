import { Hono } from 'hono';

import { authenticate } from '$lib/server/hono.middlewares';

import { getCategoryOptions } from './categories.server';

const app = new Hono().get('/', authenticate, async (c) => {
	const user = c.get('user');

	return c.json(await getCategoryOptions(user.id));
});

export default app;
