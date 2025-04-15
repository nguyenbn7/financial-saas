import type { Actions, PageServerLoad } from './$types';

import { parse, subDays } from 'date-fns';

import { zod } from 'sveltekit-superforms/adapters';
import { fail, superValidate } from 'sveltekit-superforms';

import { querySchema, transactionFormSchema } from '$features/transactions/schemas';
import { createTransaction, getTransactions } from '$features/transactions/server/service.server';

export const load = (async ({ parent, url }) => {
	const { user } = await parent();

	const query = url.searchParams
		.entries()
		.reduce((prev, curr) => Object.assign(prev, { [curr[0]]: curr[1] }), {}) as {
		[x: string]: string;
	};

	const result = await querySchema.parseAsync(query);

	const { from, to, accountId } = result;

	const defaultTo = new Date();
	const defaultFrom = subDays(defaultTo, 30);

	const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
	const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

	const transactions = await getTransactions({
		userId: user.id,
		accountId: accountId === undefined ? undefined : Number(accountId),
		startDate,
		endDate
	});

	const form = await superValidate(zod(transactionFormSchema));

	return { form, transactions };
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals, request, url }) => {
		const { user } = locals;

		if (!user) return fail(401);

		const form = await superValidate(request, zod(transactionFormSchema));

		if (!form.valid) return fail(400, { form });

		const transaction = await createTransaction({
			...form.data
		});

		const query = url.searchParams
			.entries()
			.reduce((prev, curr) => Object.assign(prev, { [curr[0]]: curr[1] }), {}) as {
			[x: string]: string;
		};

		const result = await querySchema.parseAsync(query);

		const { from, to, accountId } = result;

		const defaultTo = new Date();
		const defaultFrom = subDays(defaultTo, 30);

		const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
		const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

		const transactions = await getTransactions({
			userId: user.id,
			accountId: accountId === undefined ? undefined : Number(accountId),
			startDate,
			endDate
		});

		return { form, transactions };
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
