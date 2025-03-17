import type { Actions, PageServerLoad } from './$types';

import { fail } from '@sveltejs/kit';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { delay } from '$lib';
import {
	createCategory,
	deleteCategories,
	deleteCategory,
	getPageCategory,
	updateCategory
} from '$features/categories/server/categories.server';
import {
	insertCategorySchema,
	deleteCategoriesSchema,
	updateCategorySchema
} from '$features/categories/categories.schemas';

const { DEV } = import.meta.env;

// TODO: handle search params for dynamic page, pageSize, search

export const load = (async ({ parent }) => {
	const { user } = await parent();

	const createForm = await superValidate(zod(insertCategorySchema));
	const updateForm = await superValidate(zod(updateCategorySchema));
	const deletesForm = await superValidate(zod(deleteCategoriesSchema));

	return { createForm, updateForm, deletesForm, pagination: await getPageCategory(user.id) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const { user } = locals;

		if (!user) return fail(401);

		const createForm = await superValidate(request, zod(insertCategorySchema));

		if (DEV) await delay(1, 5);

		if (!createForm.valid) return fail(400, { createForm });

		await createCategory(user.id, createForm.data);

		createForm.message = 'Category created';

		return { createForm, pagination: await getPageCategory(user.id) };
	},

	update: async ({ locals, request }) => {
		const { user } = locals;
		if (!user) return fail(401);

		const updateForm = await superValidate(request, zod(updateCategorySchema));

		if (DEV) await delay(1, 5);

		if (!updateForm.valid) return fail(400, { updateForm });

		await updateCategory(user.id, updateForm.data);

		updateForm.message = 'Category updated';

		return { updateForm, pagination: await getPageCategory(user.id) };
	},

	delete: async ({ locals, request }) => {
		const { user } = locals;
		if (!user) return fail(401);

		const updateForm = await superValidate(request, zod(updateCategorySchema));

		if (DEV) await delay(1, 5);

		if (!updateForm.valid) return fail(400, { updateForm });

		await deleteCategory(user.id, { id: updateForm.data.id });

		updateForm.message = 'Category deleted';

		return { updateForm, pagination: await getPageCategory(user.id) };
	},

	deletes: async ({ locals, request }) => {
		const { user } = locals;
		if (!user) return fail(401);

		const deletesForm = await superValidate(request, zod(deleteCategoriesSchema));

		if (DEV) await delay(1, 5);

		if (!deletesForm.valid) return fail(400);

		await deleteCategories(user.id, { ids: deletesForm.data.ids });

		deletesForm.message = `Categories deleted`;

		return { deletesForm, pagination: await getPageCategory(user.id) };
	}
} satisfies Actions;
