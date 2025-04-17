import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { parse, subDays } from 'date-fns';

import { deletesSchema, querySchema } from '../schema';
import { deleteTransactions, getTransactions } from './repository';

const app = new Hono()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', zValidator('query', querySchema), async (c) => {
		const userId = c.get('userId');

		const { from, to, accountId } = c.req.valid('query');

		const defaultTo = new Date();
		const defaultFrom = subDays(defaultTo, 30);

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

		return c.json({
			transactions: await getTransactions({
				userId,
				accountId,
				startDate,
				endDate
			})
		});
	})
	.delete('/', zValidator('json', deletesSchema), async (c) => {
		const userId = c.get('userId');

		const { ids } = c.req.valid('json');

		const deletedTransactionIds = await deleteTransactions({ ids, userId });

		return c.json({
			deletedTransactionIds
		});
	});

export default app;
