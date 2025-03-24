// place files you want to import through the `$lib` alias in this folder.
export function rsplit(s: string, sep: string, maxsplit: number) {
	var split = s.split(sep);
	return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
}

function _delay(minSeconds: number, maxSeconds: number) {
	const min = Math.ceil(minSeconds * 1000);
	const max = Math.floor(maxSeconds * 1000);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function delay(minSeconds: number, maxSeconds: number): Promise<void> {
	return new Promise((fullfill) => setTimeout(fullfill, _delay(minSeconds, maxSeconds)));
}

export function normalizeEmail(email: string) {
	try {
		const [emailName, domainPart] = rsplit(email, '@', 1);
		return emailName.normalize('NFKC') + '@' + domainPart.toLowerCase();
	} catch {
		return email;
	}
}

export class ClientError extends Error {
	#status = 500;

	constructor(message?: string, status = 500) {
		super(message);
		this.#status = status;
	}

	get status() {
		return this.#status;
	}
}
