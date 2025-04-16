import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const user = await locals.currentUser();

	if (!user) redirect(307, '/sign-in');

	return {
		userId: user.id,
		userDisplayName: user.fullName
	};
}) satisfies LayoutServerLoad;
