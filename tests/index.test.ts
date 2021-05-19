import MockAdapter from 'axios-mock-adapter/types';
import EQP from '../src';
import { AxiosMockAdapter } from './MockAdapter';
import { sampleUser } from './mocks';

describe('EQP', () => {
	const mock = new AxiosMockAdapter('http://localhost');

	const mockAuth = (mock: MockAdapter) => {
		mock.onPost('/app/session/token', {
			grant_type: 'session',
			expires_in: 7200
		}).reply(200, { ust: 'TOKEN', expires_in: 7200, mage_id: 'MAGE_ID' });
	};

	const subject = new EQP({
		appSecret: 'pass',
		appId: 'id',
		adapter: mock
	});

	test('get mageId', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				'/users/MAGE_ID',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleUser);

		// Already tested in tests/services/UserService.test.ts
		await subject.userService.getUser(false);

		expect(subject.mageId).toBeDefined();
		expect(subject.mageId).toEqual(sampleUser.mage_id);
	});
});
