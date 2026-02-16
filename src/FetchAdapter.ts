import { Adapter, RequestConfig } from './types/adapters';
import { HttpError } from './HttpError';

export class FetchAdapter implements Adapter {
	protected readonly baseURL: string;
	protected readonly defaultHeaders: Record<string, string> = {};

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	setHeader(header: string, value: string): void {
		this.defaultHeaders[header] = value;
	}

	async get<T>(url: string, config?: RequestConfig): Promise<T> {
		return this.request<T>('GET', url, undefined, config);
	}

	async post<T>(url: string, body: unknown, config?: RequestConfig): Promise<T> {
		return this.request<T>('POST', url, body, config);
	}

	async put<T>(url: string, body: unknown, config?: RequestConfig): Promise<T> {
		return this.request<T>('PUT', url, body, config);
	}

	async delete<T>(url: string, config?: RequestConfig): Promise<T> {
		return this.request<T>('DELETE', url, undefined, config);
	}

	protected async request<T>(method: string, path: string, body: unknown, config?: RequestConfig): Promise<T> {
		let fullURL = this.baseURL + path;

		if (config?.params) {
			const params = new URLSearchParams();
			for (const [key, value] of Object.entries(config.params)) {
				if (value !== undefined) {
					params.set(key, String(value));
				}
			}
			const qs = params.toString();
			if (qs) {
				fullURL += '?' + qs;
			}
		}

		const headers: Record<string, string> = {
			'content-type': 'application/json',
			...this.defaultHeaders,
			...config?.headers
		};

		if (config?.auth) {
			const encoded = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64');
			headers['authorization'] = `Basic ${encoded}`;
		}

		const response = await fetch(fullURL, {
			method,
			headers,
			body: body !== undefined ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			let data: unknown;
			try {
				data = await response.json();
			} catch {
				data = await response.text();
			}
			throw new HttpError(response.status, response.statusText, data);
		}

		return (await response.json()) as T;
	}
}
