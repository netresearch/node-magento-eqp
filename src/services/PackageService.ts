import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { Package } from '../types';

export class PackageService {
	constructor(protected readonly adapter: AuthenticatedAdapter) {}

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
}
