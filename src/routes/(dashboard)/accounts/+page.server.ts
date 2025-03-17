import type { Actions, PageServerLoad } from './$types';

import { fail } from '@sveltejs/kit';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { delay } from '$lib';
import {
	deleteAccountsSchema,
	insertAccountSchema,
	updateAccountSchema
} from '$features/accounts/accounts.schemas';
import {
	deleteAccount,
	deleteAccounts,
	getPageAccount,
	updateAccount,
	createAccount
} from '$features/accounts/server/accounts.server';

const { DEV } = import.meta.env;

// TODO: handle search params for dynamic page, pageSize, search

export const load = (async ({ parent }) => {
	const { user } = await parent();

	const createForm = await superValidate(zod(insertAccountSchema));
	const updateForm = await superValidate(zod(updateAccountSchema));
	const deletesForm = await superValidate(zod(deleteAccountsSchema));

	return { createForm, updateForm, deletesForm, pagination: await getPageAccount(user.id) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const { user } = locals;

		if (!user) return fail(401);

		const createForm = await superValidate(request, zod(insertAccountSchema));

		if (DEV) await delay(1, 5);

		if (!createForm.valid) return fail(400, { createForm });

		await createAccount(user.id, createForm.data);

		createForm.message = 'Account created';

		return { createForm, pagination: await getPageAccount(user.id) };
	},

	update: async ({ locals, request }) => {
		const { user } = locals;

		if (!user) return fail(401);

		const updateForm = await superValidate(request, zod(updateAccountSchema));

		if (DEV) await delay(1, 5);

		if (!updateForm.valid) return fail(400, { updateForm });

		await updateAccount(user.id, updateForm.data);

		updateForm.message = 'Account updated';

		return { updateForm, pagination: await getPageAccount(user.id) };
	},

	delete: async ({ locals, request }) => {
		const { user } = locals;

		if (!user) return fail(401);

		const updateForm = await superValidate(request, zod(updateAccountSchema));

		if (DEV) await delay(1, 5);

		if (!updateForm.valid) return fail(400, { updateForm });

		await deleteAccount(user.id, { id: updateForm.data.id });

		updateForm.message = 'Account deleted';

		return { updateForm, pagination: await getPageAccount(user.id) };
	},

	deletes: async ({ locals, request }) => {
		const { user } = locals;

		if (!user) return fail(401);

		const deletesForm = await superValidate(request, zod(deleteAccountsSchema));

		if (DEV) await delay(1, 5);

		if (!deletesForm.valid) return fail(400);

		await deleteAccounts(user.id, deletesForm.data);

		deletesForm.message = 'Accounts deleted';

		return { deletesForm, pagination: await getPageAccount(user.id) };
	}
} satisfies Actions;
