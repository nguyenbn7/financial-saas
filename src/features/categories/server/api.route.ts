import { CLERK_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

import { StatusCodes } from 'http-status-codes';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware } from '@hono/clerk-auth';

import { clerkMiddlewareAuthenticated } from '$lib/server/api/middleware';

import { categoryFormSchema, categoryIdSchema, deletesSchema } from '$features/categories/schema';
import {
	createCategory,
	deleteCategories,
	getCategories,
	getCategory,
	updateCategory
} from '$features/categories/server/repository';

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

		const categories = await getCategories({ userId });

		return c.json({
			categories
		});
	})
	.get('/:id', zValidator('param', categoryIdSchema), async (c) => {
		const userId = c.get('userId');
		const { id } = c.req.valid('param');

		const [category] = await getCategory({ id, userId });

		if (!category)
			return c.json(
				{
					error: {
						code: StatusCodes.NOT_FOUND,
						message: 'Category not found'
					}
				},
				StatusCodes.NOT_FOUND
			);

		return c.json({
			category
		});
	})
	.post('/', zValidator('json', categoryFormSchema), async (c) => {
		const userId = c.get('userId');
		const formData = c.req.valid('json');

		const result = await createCategory({ userId, ...formData });

		const category = result.at(0);

		if (!category)
			return c.json(
				{
					error: {
						code: StatusCodes.CONFLICT,
						message: 'Cannot create category'
					}
				},
				StatusCodes.CONFLICT
			);

		return c.json({
			category
		});
	})
	.put(
		'/:id',
		zValidator('param', categoryIdSchema),
		zValidator('json', categoryFormSchema),
		async (c) => {
			const userId = c.get('userId');
			const { id } = c.req.valid('param');
			const formData = c.req.valid('json');

			const [existedCategory] = await getCategory({ id, userId });

			if (!existedCategory)
				return c.json(
					{
						error: {
							code: StatusCodes.NOT_FOUND,
							message: 'Account not found'
						}
					},
					StatusCodes.NOT_FOUND
				);

			const [category] = await updateCategory({ id, userId }, { ...formData });

			if (!category)
				return c.json(
					{
						error: {
							code: StatusCodes.CONFLICT,
							message: 'Cannot update category'
						}
					},
					StatusCodes.CONFLICT
				);

			return c.json({
				category
			});
		}
	)
	.delete('/', zValidator('json', deletesSchema), async (c) => {
		const userId = c.get('userId');
		const formData = c.req.valid('json');

		const deletedCategoryIds = await deleteCategories({ ...formData, userId });

		return c.json({
			deletedCategoryIds
		});
	});

export default app;
