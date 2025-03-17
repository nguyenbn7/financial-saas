// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { User } from '$lib/db.schemas';

type UserWithoutPassword = Omit<User, 'password'>;

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserWithoutPassword | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
