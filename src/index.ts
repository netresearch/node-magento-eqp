import Axios, { AxiosInstance } from 'axios';
import {
	Environment,
	EQPStatusUpdateEvent,
	File,
	Magento1Key,
	Magento2Key,
	MalwareScanCompleteEvent,
	Options,
	Package,
	RawCallbackEvent,
	User,
	UserSummary
} from './types';

export class EQP {
	protected environment: Environment;
	protected autoRefreshToken: boolean;

	protected client: AxiosInstance;

	/** The authenticated user's Magento ID */
	mageId?: string;

	constructor(options?: Partial<Options>) {
		this.environment = options?.environment ?? 'production';
		this.autoRefreshToken = options?.autoRefresh ?? false;

		this.client = Axios.create({
			baseURL: `https://developer${this.environment === 'staging' ? '-stg' : ''}-api.magento.com/rest/v1`
		});
	}

	/**
	 * Authenticate with the API. You can find the App ID and secret with the next link.
	 * @see https://developer.magento.com/account/apikeys
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/auth.html#session-token
	 * @example eqp.authenticate('APP_ID', 'APP_SECRET')
	 * @example eqp.authenticate('APP_ID', 'APP_SECRET', 3600)
	 */
	async authenticate(appId: string, appSecret: string, expiresIn?: number): Promise<void> {
		this.mageId = undefined;

		const {
			data: { expires_in, mage_id, ust }
		} = await this.client.post<{ mage_id: string; ust: string; expires_in: number }>(
			'/app/session/token',
			{ grant_type: 'session', expires_in: expiresIn ?? 7200 },
			{
				auth: {
					password: appSecret,
					username: appId
				}
			}
		);

		this.mageId = mage_id;

		this.client.defaults.headers.common['Authorization'] = `Bearer ${ust}`;

		if (this.autoRefreshToken) {
			// Re-run this function 5 seconds before the token expires
			setTimeout(() => this.authenticate(appId, appSecret), expires_in * 1000 - 5);
		}
	}

	/**
	 * Get the full user profile
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#profile-data
	 * @example eqp.getUser();
	 */
	getUser(summary: false): Promise<User>;

	/**
	 * Get a summarized version of the user profile
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#profile-data
	 * @example eqp.getUser(true);
	 */
	getUser(summary: true): Promise<UserSummary>;

	async getUser(summary = false): Promise<User | UserSummary> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}${summary ? '?style=summary' : ''}`)).data;
	}

	/**
	 * Update the profile of the authenticated user.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#update-profile-data
	 * @example eqp.updateUser({ action: 'submit', personal_profile: { bio: 'Changed with netresearch/node-magento-eqp' } })
	 */
	async updateUser(data: Partial<User & { action?: 'submit' | 'draft' }>): Promise<User> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.put(`/users/${this.mageId}`, { action: 'submit', ...data })).data;
	}

	/**
	 * Get the Magento keys owned by the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys
	 * @example eqp.getKeys()
	 * @example eqp.getKeys({ type: 'm2' })
	 * @example eqp.getKeys({ label: 'testing' })
	 */
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

	// TODO: Provide typings
	/**
	 * Get the page view reports.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	async getPageviewReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/pageviews`)).data;
	}

	// TODO: Provide typings
	/**
	 * Get the totals of all reports.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	async getTotalReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/totals`)).data;
	}

	// TODO: Provide typings
	/**
	 * Get the sales report.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	async getSalesReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/pageviews`)).data;
	}

	// TODO: Provide typings
	/**
	 * Get the reports about refunds.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	async getRefundReports(): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/users/${this.mageId}/reports/refunds`)).data;
	}

	/**
	 * Get a file by it's upload ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/files.html#get-a-file-upload
	 * @example eqp.getFile('1');
	 */
	async getFile(uploadId: string, offset?: number, limit?: number): Promise<File> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/files/uploads/${uploadId}`, { params: { offset, limit } })).data;
	}

	/**
	 * Get all packages for the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details
	 * @example eqp.getPackages()
	 */
	async getPackages(): Promise<Package[]> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get('/products/packages')).data;
	}

	/**
	 * Get a specific package by it's submission ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details
	 * @example eqp.getPackageBySubmissionId('1')
	 */
	async getPackageBySubmissionId(submissionId: string): Promise<Package> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/products/packages/${submissionId}`)).data;
	}

	/**
	 * Get a specific package by it's item ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details
	 * @example eqp.getPackageByItemId('1')
	 */
	async getPackageByItemId(itemId: string): Promise<Package> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/products/packages/items/${itemId}`)).data;
	}

	/**
	 * Get all reports or only a specific one
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/reports.html
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	async getReports(metricName?: string): Promise<unknown> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return (await this.client.get(`/reports/metrics/${metricName ?? ''}`)).data;
	}

	/**
	 * Register a callback.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/callbacks.html#register-a-callback
	 * @example eqp.registerCallback('Local test server', 'https://example.com/callback', 'magento', 'marketplace')
	 */
	async registerCallback(name: string, url: string, username: string, password: string): Promise<User> {
		if (!this.mageId) {
			throw new Error('Not authenticated.');
		}

		return this.updateUser({
			api_callbacks: [{ name, url, username, password }]
		});
	}

	/** Parse a callback request body. */
	parseCallback(
		event: EQPStatusUpdateEvent
	): Promise<{ item: Package; submission: Package; status: string; flow: string }>;

	/** Parse a callback request body. */
	parseCallback(event: MalwareScanCompleteEvent): Promise<{ file: File; result: string }>;

	async parseCallback(
		event: RawCallbackEvent
	): Promise<
		{ item: Package; submission: Package; status: string; flow: string } | { file: File; result: string }
	> {
		switch (event.callback_event) {
			case 'eqp_status_update': {
				const { update_info: updateInfo } = event as EQPStatusUpdateEvent;

				return {
					item: await this.getPackageByItemId(updateInfo.item_id),
					submission: await this.getPackageBySubmissionId(updateInfo.submission_id),
					status: updateInfo.current_status,
					flow: updateInfo.eqp_flow
				};
			}

			case 'malware_scan_complete': {
				const { update_info: updateInfo } = event as MalwareScanCompleteEvent;

				return {
					file: await this.getFile(updateInfo.file_upload_id),
					result: updateInfo.tool_result
				};
			}

			default:
				throw new Error(`unknown callback_event "${event.callback_event}"`);
		}
	}
}
