import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { userId } = locals.auth();

	if (!userId) redirect(307, '/sign-in');

	return {
		userId
	};
}) satisfies LayoutServerLoad;
