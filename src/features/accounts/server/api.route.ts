import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { accountFormSchema, accountIdSchema, deletesSchema } from '$features/accounts/schema';
import {
	createAccount,
	deleteAccounts,
	getAccount,
	getAccounts,
	updateAccount
} from '$features/accounts/server/repository';

const app = new Hono()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', async (c) => {
		const { userId } = c.var;

		const accounts = await getAccounts({ userId });

		return c.json({
			accounts
		});
	})
	.get('/:id', zValidator('param', accountIdSchema), async (c) => {
		const { userId } = c.var;
		const { id } = c.req.valid('param');

		const [account] = await getAccount({ id, userId });

		if (!account)
			return c.json(
				{
					error: {
						code: StatusCodes.NOT_FOUND,
						message: 'Account not found'
					}
				},
				StatusCodes.NOT_FOUND
			);

		return c.json({
			account
		});
	})
	.post('/', zValidator('json', accountFormSchema), async (c) => {
		const { userId } = c.var;
		const formData = c.req.valid('json');

		const [account] = await createAccount({ userId, ...formData });

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
	.put(
		'/:id',
		zValidator('param', accountIdSchema),
		zValidator('json', accountFormSchema),
		async (c) => {
			const { userId } = c.var;
			const { id } = c.req.valid('param');
			const formData = c.req.valid('json');

			const [existedAccount] = await getAccount({ id, userId });

			if (!existedAccount)
				return c.json(
					{
						error: {
							code: StatusCodes.NOT_FOUND,
							message: 'Account not found'
						}
					},
					StatusCodes.NOT_FOUND
				);

			const [account] = await updateAccount({ id, userId }, { ...formData });

			if (!account)
				return c.json(
					{
						error: {
							code: StatusCodes.CONFLICT,
							message: 'Cannot update account'
						}
					},
					StatusCodes.CONFLICT
				);

			return c.json({
				account
			});
		}
	)
	.delete('/', zValidator('json', deletesSchema), async (c) => {
		const { userId } = c.var;
		const formData = c.req.valid('json');

		const deletedAccountIds = await deleteAccounts({ ...formData, userId });

		return c.json({
			deletedAccountIds
		});
	});

export default app;
