import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { userId } = locals.auth();

	return {
		authenticated: Boolean(userId)
	};
}) satisfies LayoutServerLoad;
