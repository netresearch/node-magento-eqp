import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Adapter } from './types/adapters';

export class AxiosAdapter implements Adapter {
	protected readonly client: AxiosInstance;

	constructor(baseURL: string) {
		this.client = axios.create({ baseURL });
	}

	setHeader(header: string, value: string) {
		this.client.defaults.headers.common[header] = value;
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return (await this.client.get(url, config)).data;
	}

	async post<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
		return (await this.client.post(url, body, config)).data;
	}

	async put<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
		return (await this.client.put(url, body, config)).data;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return (await this.client.delete(url, config)).data;
	}
}
