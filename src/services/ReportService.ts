import { AuthenticatedAdapter } from '../AuthenticatedAdapter';

export class ReportService {
	constructor(protected readonly adapter: AuthenticatedAdapter) {}

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
	 * Get all reports or only a specific one
	 * Untested
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/reports.html
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#user-reports
	 */
	getReports(metricName?: string): Promise<unknown> {
		return this.adapter.get(`/reports/metrics/${metricName ?? ''}`);
	}
}
