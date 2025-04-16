import type { Actions, PageServerLoad } from './$types';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { accountFormSchema } from '$features/accounts/schema';
import { getAccounts, updateAccount, createAccount } from '$features/accounts/server/repository';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(accountFormSchema));

	return { form, accounts: await getAccounts({ userId }) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const { userId } = locals.auth();

		const form = await superValidate(request, zod(accountFormSchema.omit({ id: true })));

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		await createAccount({ userId, ...form.data });

		form.message = 'Account created';

		return { form, accounts: await getAccounts({ userId }) };
	},

	update: async ({ locals, request }) => {
		const { userId } = locals.auth();

		const form = await superValidate(request, zod(accountFormSchema));

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		const { id, ...data } = form.data;

		await updateAccount({ userId, id: form.data.id }, { ...data });

		form.message = 'Account updated';

		return { form, accounts: await getAccounts({ userId }) };
	}
} satisfies Actions;
