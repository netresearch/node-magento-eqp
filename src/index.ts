import Axios, { AxiosInstance } from 'axios';
import { Environment, Magento1Key, Magento2Key, Options, Package, User, UserSummary } from './types';

export class EQP {
	protected environment: Environment;
	protected autoRefreshToken: boolean;

	protected client: AxiosInstance;

	mageId?: string;

	constructor(options?: Partial<Options>) {
		this.environment = options?.environment ?? 'production';
		this.autoRefreshToken = options?.autoRefresh ?? false;

		this.client = Axios.create({
			baseURL: `https://developer${this.environment === 'staging' ? '-stg' : ''}-api.magento.com/rest/v1`
		});
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/auth.html#session-token */
	async authenticate(clientId: string, clientSecret: string, expiresIn?: number): Promise<void> {
		this.mageId = undefined;

		const {
			data: { expires_in, mage_id, ust }
		} = await this.client.post<{ mage_id: string; ust: string; expires_in: number }>(
			'/app/session/token',
			{ grant_type: 'session', expires_in: expiresIn ?? 7200 },
			{
				auth: {
					password: clientSecret,
					username: clientId
				}
			}
		);

		this.mageId = mage_id;

		this.client.defaults.headers.common['Authorization'] = `Bearer ${ust}`;

		if (this.autoRefreshToken) {
			// Re-run this function 5 seconds before the token expires
			setTimeout(() => this.authenticate(clientId, clientSecret), expires_in * 1000 - 5);
		}
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#profile */
	getUser(): Promise<User>;

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#profile */
	getUser(summary?: boolean): Promise<UserSummary>;

	async getUser(summary?: boolean): Promise<User | UserSummary> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}${summary ? '?style=summary' : ''}`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/auth.html#session-token */
	async updateUser(data: Partial<User & { action?: 'submit' | 'draft' }>): Promise<Package[]> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.put(`/users/${this.mageId}`, { action: 'submit', ...data })).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys */
	async getKeys(
		options?: Partial<{ type: 'all' | 'm1' | 'm2'; label: string }>
	): Promise<{ m1: Magento1Key[]; m2: Magento2Key[] }> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (
			await this.client.get(`/users/${this.mageId}/keys`, {
				params: {
					type: options?.type,
					label: options?.label
				}
			})
		).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports */
	async getPageviewReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/pageviews`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports */
	async getTotalReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/totals`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports */
	async getSalesReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/pageviews`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports */
	async getRefundReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/refunds`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/files.html#get-a-file-upload */
	async getFile(uploadId: string, offset?: number, limit?: number): Promise<File> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/files/uploads/${uploadId}`, { params: { offset, limit } })).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details */
	async getPackages(): Promise<Package[]> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get('/products/packages')).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details */
	async getPackageBySubmissionId(submissionId: string): Promise<Package[]> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/products/packages/${submissionId}`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details */
	async getItem(itemId: string): Promise<Package[]> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/products/packages/items/${itemId}`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/reports.html @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports */
	async getReports(metricName?: string): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/reports/metrics/${metricName ?? ''}`)).data;
	}

	/** @see https://devdocs.magento.com/marketplace/eqp/v1/callbacks.html#register-a-callback */
	async registerCallback(name: string, url: string, username: string, password: string): Promise<Package[]> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return this.updateUser({
			api_callbacks: [{ name, url, username, password }]
		});
	}

	// TODO
	// parseCallback(event: CallbackEvent): Promise<unknown>;
}
