import type { User } from '$lib/db.schemas';

import { env } from '$env/dynamic/private';

import { PUBLIC_APP_NAME } from '$env/static/public';

import * as jose from 'jose';
import { db } from '$lib/server/db';

/**
 * @see {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}
 */
const alg = 'HS512';

const secret = new TextEncoder().encode(env.SECRET);

export function getExpiresAt(seconds: number = 3600 /** 1 hour */) {
	const expiresAtMillis = Date.now() + seconds * 1000;
	return new Date(expiresAtMillis);
}

export async function createToken(user: User, expiresAt: Date) {
	try {
		// console.log(
		// 	await new jose.CompactEncrypt(new TextEncoder().encode(`${user.id}`))
		// 		.setProtectedHeader({ alg: 'PBES2-HS512+A256KW', enc: 'A256GCM' })
		// 		.encrypt(secret)
		// );

		return new jose.SignJWT({ sub: `${user.id}`, iss: PUBLIC_APP_NAME, aud: PUBLIC_APP_NAME })
			.setProtectedHeader({ alg })
			.setIssuedAt()
			.setExpirationTime(expiresAt)
			.sign(secret);
	} catch (error) {
		console.log(error);
		return;
	}
}

export async function verifyToken(token: string) {
	try {
		const verifiedToken = await jose.jwtVerify(token, secret, {
			issuer: PUBLIC_APP_NAME,
			audience: PUBLIC_APP_NAME
		});

		const userIdStr = verifiedToken.payload.sub;
		if (!userIdStr) return;

		if (!/^\d+$/.test(userIdStr)) return;

		const userId = Number(userIdStr);

		return db
			.selectFrom('user as u')
			.where('u.id', '=', userId)
			.select([
				'u.id',
				'u.name',
				'u.username',
				'u.email',
				'u.created_at as createdAt',
				'u.updated_at as updatedAt'
			])
			.executeTakeFirst();
	} catch (err) {
		console.error('validateAuthToken():', err);
	}
	return;
}
