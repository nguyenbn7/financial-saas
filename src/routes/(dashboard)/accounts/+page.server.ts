import type { Actions, PageServerLoad } from './$types';

import { fail } from '@sveltejs/kit';

import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { delay } from '$lib';
import { accountFormSchema } from '$features/accounts/schemas';
import {
	getPageAccount,
	updateAccount,
	createAccount
} from '$features/accounts/server/service.server';

const { DEV } = import.meta.env;

// TODO: handle search params for dynamic page, pageSize, search

export const load = (async ({ parent }) => {
	const { user } = await parent(); // TODO:

	const form = await superValidate(zod(accountFormSchema));

	return { form, pagination: await getPageAccount(user.id) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		if (DEV) await delay(1, 2);

		const { user } = locals; // TODO:

		if (!user) return fail(401);

		const form = await superValidate(request, zod(accountFormSchema));

		if (!form.valid) return fail(400, { form });

		await createAccount(user.id, form.data);

		return { form, pagination: await getPageAccount(user.id) };
	},

	update: async ({ locals, request }) => {
		if (DEV) await delay(1, 2);

		const { user } = locals; // TODO:

		if (!user) return fail(401);

		const form = await superValidate(
			request,
			zod(accountFormSchema.extend({ id: z.number().min(1) })) // TODO:
		);

		if (!form.valid) return fail(400, { form });

		await updateAccount(user.id, form.data);

		return { form, pagination: await getPageAccount(user.id) };
	}
} satisfies Actions;
