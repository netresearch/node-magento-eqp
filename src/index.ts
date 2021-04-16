import { AxiosAdapter } from './Adapters';
import { AuthenticatedAdapter } from './AuthenticatedAdapter';
import { parseCallback } from './Parser';
import { EQPStatusUpdateEvent, MalwareScanCompleteEvent, RawCallbackEvent } from './types/callbacks';
import { File, Magento1Key, Magento2Key } from './types/common';
import { EQPOptions } from './types/options';
import { Package } from './types/packages';
import { User, UserSummary } from './types/users';

export * from './types';

export class EQP {
	protected adapter: AuthenticatedAdapter;

	/** The authenticated user's Magento ID */
	get mageId(): string {
		return this.adapter.mageId as string;
	}

	constructor(options: EQPOptions) {
		this.adapter = new AuthenticatedAdapter(
			new AxiosAdapter(
				`https://developer${(options.environment ?? 'production') === 'staging' ? '-stg' : ''}-api.magento.com/rest/v1`
			),
			{
				appId: options.appId,
				appSecret: options.appSecret,
				autoRefresh: options.autoRefresh ?? false,
				tokenTTL: options.expiresIn
			}
		);
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

	getUser(summary = false): Promise<User | UserSummary> {
		return this.adapter.get(`/users/|MAGE_ID|${summary ? '?style=summary' : ''}`);
	}

	/**
	 * Update the profile of the authenticated user.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#update-profile-data
	 * @example eqp.updateUser({ action: 'submit', personal_profile: { bio: 'Changed with netresearch/node-magento-eqp' } })
	 */
	updateUser(data: Partial<User & { action?: 'submit' | 'draft' }>): Promise<User> {
		return this.adapter.put(`/users/|MAGE_ID|`, { action: 'submit', ...data });
	}

	/**
	 * Get the Magento keys owned by the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys
	 * @example eqp.getKeys()
	 * @example eqp.getKeys({ type: 'm2' })
	 * @example eqp.getKeys({ label: 'testing' })
	 */
	getKeys(options?: Partial<{ type: 'all' | 'm1' | 'm2'; label: string }>): Promise<{ m1: Magento1Key[]; m2: Magento2Key[] }> {
		return this.adapter.get(`/users/|MAGE_ID|/keys`, {
			params: {
				type: options?.type,
				label: options?.label
			}
		});
	}

	// TODO: Provide typings
	/**
	 * Get the page view reports.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	getPageviewReports(): Promise<unknown> {
		return this.adapter.get(`/users/|MAGE_ID|/reports/pageviews`);
	}

	// TODO: Provide typings
	/**
	 * Get the totals of all reports.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	getTotalReports(): Promise<unknown> {
		return this.adapter.get(`/users/|MAGE_ID|/reports/totals`);
	}

	// TODO: Provide typings
	/**
	 * Get the sales report.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	getSalesReports(): Promise<unknown> {
		return this.adapter.get(`/users/|MAGE_ID|/reports/pageviews`);
	}

	// TODO: Provide typings
	/**
	 * Get the reports about refunds.
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	getRefundReports(): Promise<unknown> {
		return this.adapter.get(`/users/|MAGE_ID|/reports/refunds`);
	}

	/**
	 * Get a file by it's upload ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/files.html#get-a-file-upload
	 * @example eqp.getFile('1');
	 */
	getFile(uploadId: string, offset?: number, limit?: number): Promise<File> {
		return this.adapter.get(`/files/uploads/${uploadId}`, { params: { offset, limit } });
	}

	/**
	 * Get all packages for the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details
	 * @example eqp.getPackages()
	 */
	getPackages(): Promise<Package[]> {
		return this.adapter.get('/products/packages');
	}

	/**
	 * Get a specific package by it's submission ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details
	 * @example eqp.getPackageBySubmissionId('1')
	 */
	getPackageBySubmissionId(submissionId: string): Promise<Package> {
		return this.adapter.get(`/products/packages/${submissionId}`);
	}

	/**
	 * Get a specific package by it's item ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/packages.html#get-package-details
	 * @example eqp.getPackageByItemId('1')
	 */
	getPackageByItemId(itemId: string): Promise<Package> {
		return this.adapter.get(`/products/packages/items/${itemId}`);
	}

	/**
	 * Get all reports or only a specific one
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/reports.html
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	getReports(metricName?: string): Promise<unknown> {
		return this.adapter.get(`/reports/metrics/${metricName ?? ''}`);
	}

	/**
	 * Register a callback.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/callbacks.html#register-a-callback
	 * @example eqp.registerCallback('Local test server', 'https://example.com/callback', 'magento', 'marketplace')
	 */
	registerCallback(name: string, url: string, username: string, password: string): Promise<User> {
		return this.updateUser({
			api_callbacks: [{ name, url, username, password }]
		});
	}

	/** Parse a callback request body. */
	parseCallback(event: EQPStatusUpdateEvent): Promise<{ item: Package; submission: Package; status: string; flow: string }>;

	/** Parse a callback request body. */
	parseCallback(event: MalwareScanCompleteEvent): Promise<{ file: File; submissions: Package[]; result: string }>;

	parseCallback(
		event: RawCallbackEvent
	): Promise<
		{ item?: Package; submission: Package; status: string; flow: string } | { file: File; submissions: Package[]; result: string }
	> {
		return parseCallback(this, event);
	}
}
