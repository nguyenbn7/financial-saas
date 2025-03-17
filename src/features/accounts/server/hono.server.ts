import { Hono } from 'hono';

import { authenticate } from '$lib/server/hono.middlewares';

import { getAccountOptions } from './accounts.server';

const app = new Hono().get('/', authenticate, async (c) => {
	const user = c.get('user');

	return c.json(await getAccountOptions(user.id));
});

export default app;
