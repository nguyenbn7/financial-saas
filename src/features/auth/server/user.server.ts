import type { User } from '$lib/db.schemas';
import { db } from '$lib/server/db';

import bcrypt from 'bcrypt';

export async function getUserByUsername(email: string) {
	return db
		.selectFrom('user as u')
		.where('u.username', '=', normalizeEmail(email))
		.select([
			'u.id',
			'u.name',
			'u.username',
			'u.password',
			'u.email',
			'u.created_at as createdAt',
			'u.updated_at as updatedAt'
		])
		.executeTakeFirst();
}

export async function createUser(
	data: { name: string; email: string },
	password: string,
	saltOrRounds: string | number = 12
) {
	const hashedPassword = await bcrypt.hash(password, saltOrRounds);
	data.name = data.name.trim();
	data.email = normalizeEmail(data.email);

	return db
		.insertInto('user')
		.values({
			name: data.name,
			username: data.email,
			email: data.email,
			password: hashedPassword
		})
		.returning([
			'id',
			'name',
			'password',
			'username',
			'email',
			'created_at as createdAt',
			'updated_at as updatedAt'
		])
		.executeTakeFirst();
}

export async function comparePasswords(user: User, password: string) {
	return bcrypt.compare(password, user.password);
}

function normalizeEmail(email: string) {
	try {
		const [emailName, domainPart] = rsplit(email, '@', 1);
		return emailName.normalize('NFKC') + '@' + domainPart.toLowerCase();
	} catch {
		return email;
	}
}
