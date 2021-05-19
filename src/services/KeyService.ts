import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { Magento1Key, Magento2Key } from '../types';

export class KeyService {
	constructor(protected readonly adapter: AuthenticatedAdapter) {}

	// /**
	//  * Get all Magento keys owned by the authenticated account.
	//  * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys
	//  * @example eqp.getKeys()
	//  * @example eqp.getKeys({ label: 'testing' })
	//  */
	// getKeys(options?: Partial<{ type: 'all' | 'm1' | 'm2'; label: string }>): Promise<{ m1: Magento1Key[]; m2: Magento2Key[] }>;

	/**
	 * Get all Magento keys owned by the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys
	 * @example eqp.getKeys({ type: 'all' })
	 * @example eqp.getKeys({ type: 'all', label: 'testing' })
	 */
	getKeys(options: { type: 'all'; label?: string }): Promise<{ m1: Magento1Key[]; m2: Magento2Key[] }>;

	/**
	 * Get all Magento 1 keys owned by the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys
	 * @example eqp.getKeys({ type: 'm1' })
	 * @example eqp.getKeys({ type: 'm1', label: 'testing' })
	 */
	getKeys(options: { type: 'm1'; label?: string }): Promise<{ m1: Magento1Key[] }>;

	/**
	 * Get the Magento keys owned by the authenticated account.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/users.html#get-keys
	 * @example eqp.getKeys({ type: 'm2' })
	 * @example eqp.getKeys({ type: 'm2', label: 'testing' })
	 */
	getKeys(options: { type: 'm2'; label?: string }): Promise<{ m2: Magento2Key[] }>;

	getKeys(
		options: { type: 'all' | 'm1' | 'm2'; label?: string } = { type: 'all' }
	): Promise<{ m1: Magento1Key[]; m2: Magento2Key[] } | { m1: Magento1Key[] } | { m2: Magento2Key[] }> {
		return this.adapter.get(`/users/|MAGE_ID|/keys`, {
			params: {
				type: options.type,
				label: options.label
			}
		});
	}
}
