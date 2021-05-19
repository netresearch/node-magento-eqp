import MockAdapter from 'axios-mock-adapter/types';
import { AuthenticatedAdapter, PackageService } from '../../src';
import { AxiosMockAdapter } from '../MockAdapter';
import { samplePackage } from '../mocks';

describe('PackageService', () => {
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

	const subject = new PackageService(authAdapter);

	test('getPackages()', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				'/products/packages',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, [samplePackage]);

		const response = await subject.getPackages();

		expect(response).toBeDefined();
		expect(response).toEqual(expect.arrayContaining([samplePackage]));
	});
});
