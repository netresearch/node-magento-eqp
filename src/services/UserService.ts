import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { User, UserSummary } from '../types';

export class UserService {
	constructor(protected readonly adapter: AuthenticatedAdapter) {}

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
}
