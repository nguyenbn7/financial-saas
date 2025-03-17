import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
	const { authenticated } = await parent();

	if (authenticated) redirect(307, '/dashboard');
}) satisfies LayoutServerLoad;
