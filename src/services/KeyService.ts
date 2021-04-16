import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { Magento1Key, Magento2Key } from '../types';

export class KeyService {
	constructor(protected readonly adapter: AuthenticatedAdapter) {}

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
}
