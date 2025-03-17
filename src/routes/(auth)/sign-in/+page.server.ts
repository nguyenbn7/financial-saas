import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';

import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { ACCESS_TOKEN } from '$features/auth/auth.constants';
import { signInSchema } from '$features/auth/auth.schemas';
import { createToken, getExpiresAt } from '$features/auth/server/auth.server';
import { comparePasswords, getUserByUsername } from '$features/auth/server/user.server';

export const load = (async () => {
	const form = await superValidate(zod(signInSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signInSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const user = await getUserByUsername(data.email);
		if (!user) return message(form, 'Email or password incorrect', { status: 400 });

		const passwordsMatch = await comparePasswords(user, data.password);
		if (!passwordsMatch) return message(form, 'Email or password incorrect', { status: 400 });

		const expiresAt = getExpiresAt();
		const accessToken = await createToken(user, expiresAt);

		if (!accessToken)
			return message(form, 'Something went wrong. Please try again', { status: 500 });

		cookies.set(ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			sameSite: 'lax',
			expires: expiresAt,
			path: '/'
		});

		redirect(303, '/dashboard');
	}
} satisfies Actions;
