import type { PageServerLoad } from './$types';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

import { categoryFormSchema } from '$features/categories/schema';
import { getCategories } from '$features/categories/server/repository';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(categoryFormSchema));

	const categories = await getCategories({ userId });

	return { form, categories };
}) satisfies PageServerLoad;
