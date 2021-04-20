import { AxiosRequestConfig } from 'axios';
import { Adapter } from './types/adapters';

export class AuthenticatedAdapter {
	protected authenticated = false;
	mageId?: string;

	constructor(
		protected readonly baseAdapter: Adapter,
		protected readonly credentials: {
			appSecret: string;
			appId: string;
			autoRefresh?: boolean;
			tokenTTL?: number;
		}
	) {}

	protected replaceMageIdInURL(url: string): string {
		return url.replace(/\|MAGE_ID\|/, this.mageId as string);
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		await this.authenticate();

		return this.baseAdapter.get(this.replaceMageIdInURL(url), config);
	}

	async post<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
		await this.authenticate();

		return this.baseAdapter.post(this.replaceMageIdInURL(url), body, config);
	}

	async put<T>(url: string, body: unknown, config?: AxiosRequestConfig): Promise<T> {
		await this.authenticate();

		return this.baseAdapter.put(this.replaceMageIdInURL(url), body, config);
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		await this.authenticate();

		return this.baseAdapter.delete(this.replaceMageIdInURL(url), config);
	}

	async getMageId(): Promise<string> {
		await this.authenticate();

		return this.mageId as string;
	}

	/**
	 * Authenticate with the API. You can find the App ID and secret with the next link.
	 * @see https://developer.magento.com/account/apikeys
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/auth.html#session-token
	 * @example eqp.authenticate('APP_ID', 'APP_SECRET')
	 * @example eqp.authenticate('APP_ID', 'APP_SECRET', 3600)
	 */
	protected async authenticate(): Promise<void> {
		if (this.authenticated) {
			return;
		}

		this.mageId = undefined;

		const { expires_in, mage_id, ust } = await this.baseAdapter.post<{
			mage_id: string;
			ust: string;
			expires_in: number;
		}>(
			'/app/session/token',
			{ grant_type: 'session', expires_in: this.credentials.tokenTTL ?? 7200 },
			{
				auth: {
					username: this.credentials.appId,
					password: this.credentials.appSecret
				}
			}
		);

		this.mageId = mage_id;

		this.baseAdapter.setHeader('Authorization', `Bearer ${ust}`);

		if (this.credentials.autoRefresh) {
			// Re-run this function 5 seconds before the token expires
			setTimeout(() => this.authenticate(), (expires_in - 5) * 1000);
		}

		this.authenticated = true;
	}
}
