import type { PageServerLoad } from './$types';

import { accountSchema } from '$features/accounts/schema';
import { getAccounts } from '$features/accounts/server/repository';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(accountSchema));

	const accounts = await getAccounts({ userId });

	return { form, accounts };
}) satisfies PageServerLoad;
