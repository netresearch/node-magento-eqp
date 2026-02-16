export interface RequestConfig {
	auth?: { username: string; password: string };
	headers?: Record<string, string>;
	params?: Record<string, string | number | boolean | undefined>;
}

export interface Adapter {
	setHeader(header: string, value: string): void;

	get<T>(url: string, config?: RequestConfig): Promise<T>;
	post<T>(url: string, body: unknown, config?: RequestConfig): Promise<T>;
	put<T>(url: string, body: unknown, config?: RequestConfig): Promise<T>;
	delete<T>(url: string, config?: RequestConfig): Promise<T>;
}
