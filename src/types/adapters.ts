import { AxiosRequestConfig } from 'axios';

export interface Adapter {
	setHeader(header: string, value: string): void;

	get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T>;
	put<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T>;
	delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
