import MockAdapter from 'axios-mock-adapter/types';
import { AuthenticatedAdapter } from '../../src/AuthenticatedAdapter';
import { KeyService } from '../../src/services/KeyService';
import { Magento1Key, Magento2Key } from '../../src/types';
import { AxiosMockAdapter } from '../MockAdapter';

describe('KeyService', () => {
	const mock = new AxiosMockAdapter('http://localhost');

	const mockAuth = (mock: MockAdapter) => {
		mock.onPost('/app/session/token', {
			grant_type: 'session',
			expires_in: 7200
		}).reply(200, { ust: 'TOKEN', expires_in: 7200, mage_id: 'MAGE_ID' });
	};

	const authAdapter = new AuthenticatedAdapter(mock, {
		appSecret: 'pass',
		appId: 'id'
	});

	const subject = new KeyService(authAdapter);

	test('getKeys() with success', async () => {
		mockAuth(mock.mockAdapter);

		const sampleM1Key: Magento1Key = {
			product_key: '',
			product_name: 'Magento 1'
		};

		const sampleM2Key: Magento2Key = {
			is_enabled: true,
			label: 'Magento 2 Sample key',
			password_key: 'blah',
			user_key: 'blah'
		};

		mock.mockAdapter
			.onGet(
				'/users/MAGE_ID/keys',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply((config) => {
				if (config.params.type === 'm1') {
					return [200, { m1: [sampleM1Key] }];
				} else if (config.params.type === 'm2') {
					return [200, { m1: [sampleM2Key] }];
				} else {
					return [200, { m1: [sampleM1Key], m2: [sampleM2Key] }];
				}
			});

		const response = await subject.getKeys({ type: 'm1' });

		expect(response).toBeDefined();
		expect(response.m1).toEqual(expect.arrayContaining([sampleM1Key]));
	});

	test('getKeys() with error', async () => {
		mockAuth(mock.mockAdapter);

		try {
			mock.mockAdapter
				.onGet(
					'/users/MAGE_ID/keys',
					undefined,
					expect.objectContaining({
						Authorization: expect.stringMatching('Bearer TOKEN')
					})
				)
				.reply(400, {
					code: 1208,
					message: 'Insufficient information for Technical Submission'
				});

			await subject.getKeys({ type: 'm1' });
		} catch (e) {
			expect(e.toString()).toMatch('Error: Request failed with status code 400');
		}
	});
});
