import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { accountFormSchema, deletesSchema } from '$features/accounts/schema';
import { createAccount, deleteAccounts, getAccounts } from '$features/accounts/server/repository';

const app = new Hono()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', async (c) => {
		const userId = c.get('userId');

		return c.json({
			accounts: await getAccounts({ userId })
		});
	})
	.post('/', zValidator('json', accountFormSchema), async (c) => {
		const userId = c.get('userId');
		const { name } = c.req.valid('json');

		const result = await createAccount({ userId, name });

		const account = result.at(0);

		if (!account)
			return c.json(
				{
					error: {
						code: StatusCodes.CONFLICT,
						message: 'Cannot create account'
					}
				},
				StatusCodes.CONFLICT
			);

		return c.json({
			account
		});
	})
	.delete('/', zValidator('json', deletesSchema), async (c) => {
		const userId = c.get('userId');
		const { ids } = c.req.valid('json');

		const deletedAccountIds = await deleteAccounts({ ids, userId });

		return c.json({
			deletedAccountIds
		});
	});

export default app;
