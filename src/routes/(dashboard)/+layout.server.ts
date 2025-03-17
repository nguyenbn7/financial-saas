import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { user } = locals;

	if (!user) redirect(307, '/sign-in');

	return {
		user
	};
}) satisfies LayoutServerLoad;
