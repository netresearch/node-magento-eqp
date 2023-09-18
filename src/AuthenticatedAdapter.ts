import { AxiosRequestConfig } from 'axios';
import { Adapter } from './types/adapters';

const replaceMageIdInURL = (url: string, mageId: string) => url.replace(/\|MAGE_ID\|/, mageId);
const addHeaders = (config: AxiosRequestConfig | undefined, headers: Record<string, string>) => ({ ...config, headers: { ...config?.headers, ...headers } });

export class AuthenticatedAdapter {
	constructor(
		protected readonly baseAdapter: Adapter,
		protected readonly credentials: {
			appSecret: string;
			appId: string;
		}
	) { }

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const [mageId, headers] = await this.authenticate();

		return this.baseAdapter.get(replaceMageIdInURL(url, mageId), addHeaders(config, headers));
	}

	async post<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
		const [mageId, headers] = await this.authenticate();

		return this.baseAdapter.post(replaceMageIdInURL(url, mageId), body, addHeaders(config, headers));
	}

	async put<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
		const [mageId, headers] = await this.authenticate();

		return this.baseAdapter.put(replaceMageIdInURL(url, mageId), body, addHeaders(config, headers));
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const [mageId, headers] = await this.authenticate();

		return this.baseAdapter.delete(replaceMageIdInURL(url, mageId), addHeaders(config, headers));
	}

	async getMageId(): Promise<string> {
		const [mageId] = await this.authenticate();

		return mageId;
	}

	/**
	 * Authenticate with the API. You can find the App ID and secret with the next link.
	 * @see https://developer.magento.com/account/apikeys
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/auth.html#session-token
	 */
	protected async authenticate() {
		const { mage_id, ust } = await this.baseAdapter.post<{
			mage_id: string;
			ust: string;
			expires_in: number;
		}>(
			'/app/session/token',
			{ grant_type: 'session', expires_in: 360 },
			{
				auth: {
					username: this.credentials.appId,
					password: this.credentials.appSecret
				}
			}
		);

		return [mage_id, { authorization: `Bearer ${ust}` }] as const;
	}
}
