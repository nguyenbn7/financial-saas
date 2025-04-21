import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { parse, subDays } from 'date-fns';

import {
	bulkTransaction,
	deletesSchema,
	querySchema,
	transactionFormSchema,
	transactionIdSchema
} from '$features/transactions/schema';
import {
	createTransaction,
	createTransactions,
	deleteTransactions,
	getTransaction,
	getTransactions,
	updateTransaction
} from '$features/transactions/server/repository';

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
	.get('/:id', zValidator('param', transactionIdSchema), async (c) => {
		const userId = c.get('userId');
		const { id } = c.req.valid('param');

		const [transaction] = await getTransaction({ id, userId });

		if (!transaction)
			return c.json(
				{
					error: {
						code: StatusCodes.NOT_FOUND,
						message: 'Transaction not found'
					}
				},
				StatusCodes.NOT_FOUND
			);

		return c.json({
			transaction
		});
	})
	.post('/', zValidator('json', transactionFormSchema), async (c) => {
		const formData = c.req.valid('json');

		const [transaction] = await createTransaction({ ...formData });

		if (!transaction)
			return c.json(
				{
					error: {
						code: StatusCodes.CONFLICT,
						message: 'Cannot create transaction'
					}
				},
				StatusCodes.CONFLICT
			);

		return c.json({
			transaction
		});
	})
	.post('/bulk', zValidator('json', bulkTransaction), async (c) => {
		const body = c.req.valid('json');

		const transactions = await createTransactions(body);

		return c.json({
			transactions
		});
	})
	.put(
		'/:id',
		zValidator('param', transactionIdSchema),
		zValidator('json', transactionFormSchema),
		async (c) => {
			const userId = c.get('userId');
			const { id } = c.req.valid('param');
			const formData = c.req.valid('json');

			const [existedTransaction] = await getTransaction({ id, userId });

			if (!existedTransaction)
				return c.json(
					{
						error: {
							code: StatusCodes.NOT_FOUND,
							message: 'Transaction not found'
						}
					},
					StatusCodes.NOT_FOUND
				);

			const [transaction] = await updateTransaction({ id, userId }, { ...formData });

			if (!transaction)
				return c.json(
					{
						error: {
							code: StatusCodes.CONFLICT,
							message: 'Cannot update transaction'
						}
					},
					StatusCodes.CONFLICT
				);

			return c.json({
				transaction
			});
		}
	)
	.delete('/', zValidator('json', deletesSchema), async (c) => {
		const userId = c.get('userId');
		const formData = c.req.valid('json');

		const deletedTransactionIds = await deleteTransactions({ ...formData, userId });

		return c.json({
			deletedTransactionIds
		});
	});

export default app;
