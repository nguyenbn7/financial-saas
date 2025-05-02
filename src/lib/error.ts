export class ClientError extends Error {
	#status;
	#detail;

	constructor(error: { title: string; detail: string; status?: number }, options?: ErrorOptions) {
		const { title, detail, status } = error;

		super(title, options);

		this.#status = status;
		this.#detail = detail;
	}

	get status() {
		return this.#status;
	}

	get detail() {
		return this.#detail;
	}
}
