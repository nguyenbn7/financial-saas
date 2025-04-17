import type { Actions, PageServerLoad } from './$types';

import { StatusCodes } from 'http-status-codes';

import { parse, subDays } from 'date-fns';

import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { getAccounts } from '$features/accounts/server/repository';

import { getCategories } from '$features/categories/server/repository';

import { querySchema, transactionFormSchema } from '$features/transactions/schema';
import { createTransaction, getTransactions } from '$features/transactions/server/repository';

export const load = (async ({ parent, url }) => {
	const { userId } = await parent();

	const query = url.searchParams
		.entries()
		.reduce((prev, curr) => Object.assign(prev, { [curr[0]]: curr[1] }), {}) as {
		[x: string]: string;
	};

	const result = await querySchema.safeParseAsync(query);

	const { from, to, accountId } = result.data ?? {
		from: undefined,
		to: undefined,
		accountId: undefined
	};

	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
	const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

	const transactions = await getTransactions({
		userId,
		accountId,
		startDate,
		endDate
	});

	const accounts = await getAccounts({
		userId
	});

	const categories = await getCategories({
		userId
	});

	const form = await superValidate(zod(transactionFormSchema));

	return { form, transactions, accounts, categories };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request, url }) => {
		const { userId } = locals.auth();

		const form = await superValidate(request, zod(transactionFormSchema));

		if (!userId) return message(form, 'Login required', { status: StatusCodes.UNAUTHORIZED });

		if (!form.valid) return message(form, 'Invalid data', { status: StatusCodes.BAD_REQUEST });

		const [createdTransaction] = await createTransaction({ ...form.data });

		if (!createdTransaction)
			return message(form, 'Cannot create transaction', { status: StatusCodes.CONFLICT });

		return message(form, 'Transaction created');
	}

	// update: async ({ locals, request }) => {
	// 	const { user } = locals; // TODO:

	// 	if (!user) return fail(401);

	// 	const form = await superValidate(
	// 		request,
	// 		zod(categoryFormSchema.extend({ id: z.number().min(1) })) // TODO:
	// 	);

	// 	if (!form.valid) return fail(400, { form });

	// 	await updateCategory(user.id, form.data);

	// 	return { form, pagination: await getPageCategory(user.id) };
	// }
} satisfies Actions;
