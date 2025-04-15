import type { Actions, PageServerLoad } from './$types';

import { fail } from '@sveltejs/kit';

import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { categoryFormSchema } from '$features/categories/schemas';
import {
	getPageCategory,
	updateCategory,
	createCategory
} from '$features/categories/server/service.server';

// TODO: handle search params for dynamic page, pageSize, search

export const load = (async ({ parent }) => {
	const { user } = await parent(); // TODO:

	const form = await superValidate(zod(categoryFormSchema));

	return { form, pagination: await getPageCategory(user.id) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const { user } = locals; // TODO:

		if (!user) return fail(401);

		const form = await superValidate(request, zod(categoryFormSchema));

		if (!form.valid) return fail(400, { form });

		await createCategory(user.id, form.data);

		return { form, pagination: await getPageCategory(user.id) };
	},

	update: async ({ locals, request }) => {
		const { user } = locals; // TODO:

		if (!user) return fail(401);

		const form = await superValidate(
			request,
			zod(categoryFormSchema.extend({ id: z.number().min(1) })) // TODO:
		);

		if (!form.valid) return fail(400, { form });

		await updateCategory(user.id, form.data);

		return { form, pagination: await getPageCategory(user.id) };
	}
} satisfies Actions;
