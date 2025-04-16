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

export type ResponseError = {
	error: {
		code: number;
		message: string;
	};
};
