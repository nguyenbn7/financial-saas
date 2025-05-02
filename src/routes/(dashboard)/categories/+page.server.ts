import type { PageServerLoad } from './$types';

import { categorySchema } from '$features/categories/schema';
import { getCategories } from '$features/categories/server/repository';

import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const load = (async ({ parent }) => {
	const { userId } = await parent();

	const form = await superValidate(zod(categorySchema));

	const categories = await getCategories({ userId });

	return { form, categories };
}) satisfies PageServerLoad;
