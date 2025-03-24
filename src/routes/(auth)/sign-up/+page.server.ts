import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';

import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { ACCESS_TOKEN } from '$features/auth/constants';
import { signUpSchema } from '$features/auth/schemas';
import { createUser, getUserByUsername } from '$features/auth/server/user.server';
import { createToken, getExpiresAt } from '$features/auth/server/service.server';

export const load = (async () => {
	const form = await superValidate(zod(signUpSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signUpSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const existedUser = await getUserByUsername(data.email);
		if (existedUser) return message(form, 'User exists', { status: 400 });

		const user = await createUser({ name: data.name, email: data.email }, data.password);
		if (!user) return message(form, 'Can not create user', { status: 400 });

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
