import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, locals }) => {
	const { authenticated } = await parent();

	if (!authenticated) redirect(307, '/sign-in');

	return {
		displayName: locals.user!.name
	};
}) satisfies LayoutServerLoad;
