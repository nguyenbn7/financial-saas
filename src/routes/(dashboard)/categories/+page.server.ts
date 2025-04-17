import type { Actions, PageServerLoad } from './$types';

import { StatusCodes } from 'http-status-codes';

import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { categoryFormSchema, categoryIdSchema } from '$features/categories/schema';
import {
	updateCategory,
	createCategory,
	getCategories
} from '$features/categories/server/repository';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(categoryFormSchema));

	return { form, categories: await getCategories({ userId }) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const { userId } = locals.auth();

		const form = await superValidate(request, zod(categoryFormSchema));

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		const createdCategories = await createCategory({ userId, ...form.data });

		const createdCategory = createdCategories.at(0);

		if (!createdCategory)
			return message(form, 'Cannot create category', { status: StatusCodes.CONFLICT });

		return message(form, 'Category created');
	},

	update: async ({ locals, request }) => {
		const { userId } = locals.auth();

		const form = await superValidate(
			request,
			zod(categoryFormSchema.extend(categoryIdSchema.shape))
		);

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		const { id, ...data } = form.data;

		const updatedCategories = await updateCategory({ userId, id: form.data.id }, { ...data });

		const updatedCategory = updatedCategories.at(0);

		if (!updatedCategory)
			return message(form, 'Cannot update category', { status: StatusCodes.CONFLICT });

		return message(form, 'Category updated');
	}
} satisfies Actions;
