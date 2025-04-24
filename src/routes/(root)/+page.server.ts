import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { userId } = locals.auth();

	if (userId) redirect(308, '/dashboard');

	return {};
}) satisfies PageServerLoad;
