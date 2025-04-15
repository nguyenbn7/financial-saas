import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { authenticate } from '$lib/server/middlewares';

import { accountFormSchema, deletesSchema } from '../schemas';
import { createAccount, deleteAccounts, getAccountOptions, getPageAccount } from './service.server';

import { delay } from '$lib';

const { DEV } = import.meta.env;

const app = new Hono()
	.get('/options', authenticate, async (c) => {
		const user = c.get('user');

		return c.json(await getAccountOptions(user.id));
	})
	.post('/', authenticate, zValidator('json', accountFormSchema.omit({ id: true })), async (c) => {
		const user = c.get('user');
		const { name } = c.req.valid('json');

		const newAccount = await createAccount(user.id, { name });

		return c.json({ data: newAccount });
	})
	.delete('/', authenticate, zValidator('json', deletesSchema), async (c) => {
		const user = c.get('user');
		const { ids } = c.req.valid('json');

		await deleteAccounts(user.id, { ids });

		return c.json({ pagination: await getPageAccount(user.id) });
	});

export default app;
