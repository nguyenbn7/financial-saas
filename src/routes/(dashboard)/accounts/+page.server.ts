import type { Actions, PageServerLoad } from './$types';

import { StatusCodes } from 'http-status-codes';

import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { accountFormSchema, accountIdSchema } from '$features/accounts/schema';
import { getAccounts, updateAccount, createAccount } from '$features/accounts/server/repository';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(accountFormSchema));

	return { form, accounts: await getAccounts({ userId }) };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request }) => {
		const { userId } = locals.auth();

		const form = await superValidate(request, zod(accountFormSchema));

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		const createdAccounts = await createAccount({ userId, ...form.data });

		const createdAccount = createdAccounts.at(0);

		if (!createdAccount)
			return message(form, 'Cannot create account', { status: StatusCodes.CONFLICT });

		return message(form, 'Account created');
	},

	update: async ({ locals, request }) => {
		const { userId } = locals.auth();

		const form = await superValidate(request, zod(accountFormSchema.extend(accountIdSchema.shape)));

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		const { id, ...data } = form.data;

		const updatedAccounts = await updateAccount({ userId, id: form.data.id }, { ...data });

		const updatedAccount = updatedAccounts.at(0);

		if (!updatedAccount)
			return message(form, 'Cannot update account', { status: StatusCodes.CONFLICT });

		return message(form, 'Account updated');
	}
} satisfies Actions;
