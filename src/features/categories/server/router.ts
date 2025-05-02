import type { RequestIdVariables } from 'hono/request-id';

import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import {
	categorySchema,
	categoryIdSchema,
	deleteCategoriesSchema
} from '$features/categories/schema';
import {
	createCategory,
	deleteCategories,
	getCategories,
	getCategory,
	updateCategory
} from '$features/categories/server/repository';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

interface Env {
	Variables: RequestIdVariables;
}

const app = new Hono<Env>()
	.use(
		clerkMiddleware({
			secretKey: CLERK_SECRET_KEY,
			publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY
		})
	)
	.use(clerkMiddlewareAuthenticated())
	.get('/', async (c) => {
		const { userId } = c.var;

		const categories = await getCategories({ userId });

		return c.json({
			categories
		});
	})
	.get('/:id', zValidator('param', categoryIdSchema), async (c) => {
		const { userId } = c.var;
		const { id } = c.req.valid('param');

		const [category] = await getCategory({ id, userId });

		if (!category) {
			const { requestId } = c.var;

			return c.json(
				{
					requestId,
					status: StatusCodes.NOT_FOUND,
					title: ReasonPhrases.NOT_FOUND,
					detail: `Category with id '${id}' not found`
				},
				StatusCodes.NOT_FOUND
			);
		}

		return c.json({
			category
		});
	})
	.post('/', zValidator('json', categorySchema), async (c) => {
		const { userId } = c.var;
		const formData = c.req.valid('json');

		const result = await createCategory({ userId, ...formData });

		const category = result.at(0);

		if (!category) {
			const { requestId } = c.var;

			return c.json(
				{
					requestId,
					status: StatusCodes.UNPROCESSABLE_ENTITY,
					title: ReasonPhrases.UNPROCESSABLE_ENTITY,
					detail: 'Cannot create category'
				},
				StatusCodes.UNPROCESSABLE_ENTITY
			);
		}

		return c.json({
			category
		});
	})
	.put(
		'/:id',
		zValidator('param', categoryIdSchema),
		zValidator('json', categorySchema),
		async (c) => {
			const { userId } = c.var;
			const { id } = c.req.valid('param');
			const jsonData = c.req.valid('json');

			const [existedCategory] = await getCategory({ id, userId });

			if (!existedCategory) {
				const { requestId } = c.var;

				return c.json(
					{
						requestId,
						status: StatusCodes.NOT_FOUND,
						title: ReasonPhrases.NOT_FOUND,
						detail: `Category with id '${id}' not found`
					},
					StatusCodes.NOT_FOUND
				);
			}

			const [category] = await updateCategory({ id, userId }, { ...jsonData });

			if (!category) {
				const { requestId } = c.var;

				return c.json(
					{
						requestId,
						status: StatusCodes.UNPROCESSABLE_ENTITY,
						title: ReasonPhrases.UNPROCESSABLE_ENTITY,
						detail: 'Cannot update category'
					},
					StatusCodes.UNPROCESSABLE_ENTITY
				);
			}

			return c.json({
				category
			});
		}
	)
	.delete('/', zValidator('json', deleteCategoriesSchema), async (c) => {
		const { userId } = c.var;
		const jsonData = c.req.valid('json');

		const deletedCategoryIds = await deleteCategories({ ...jsonData, userId });

		return c.json({
			deletedCategoryIds
		});
	});

export default app;
