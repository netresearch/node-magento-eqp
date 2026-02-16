export class HttpError extends Error {
	readonly status: number;
	readonly statusText: string;
	readonly data: unknown;

	constructor(status: number, statusText: string, data: unknown) {
		super(`HTTP ${status}: ${statusText}`);
		this.name = 'HttpError';
		this.status = status;
		this.statusText = statusText;
		this.data = data;
	}
}
