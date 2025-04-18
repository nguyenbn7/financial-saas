import type { PageServerLoad } from './$types';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { accountFormSchema } from '$features/accounts/schema';
import { getAccounts } from '$features/accounts/server/repository';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(accountFormSchema));

	const accounts = await getAccounts({ userId });

	return { form, accounts };
}) satisfies PageServerLoad;
