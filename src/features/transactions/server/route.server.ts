import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { parse, subDays } from 'date-fns';

import { authenticate } from '$lib/server/api/middleware';

import { deletesSchema, querySchema } from '../schemas';
import { deleteTransactions, getTransactions } from './service.server';

const app = new Hono().delete(
	'/',
	authenticate,
	zValidator('json', deletesSchema),
	zValidator('query', querySchema),
	async (c) => {
		const user = c.get('user');
		const { ids } = c.req.valid('json');

		await deleteTransactions({ ids, userId: user.id });

		const { from, to, accountId } = c.req.valid('query');

		const defaultTo = new Date();
		const defaultFrom = subDays(defaultTo, 30);

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

		const transactions = await getTransactions({
			userId: user.id,
			accountId: accountId === undefined ? undefined : Number(accountId),
			startDate,
			endDate
		});

		return c.json({ transactions });
	}
);

export default app;
