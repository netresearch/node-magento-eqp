import MockAdapter from 'axios-mock-adapter/types';
import { UserService } from '../../src';
import { AuthenticatedAdapter } from '../../src/AuthenticatedAdapter';
import { AxiosMockAdapter } from '../MockAdapter';
import { sampleUser, sampleUserSummary } from '../mocks';

describe('UserService', () => {
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

	const subject = new UserService(authAdapter);

	test('getUser() with success', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				`/users/${sampleUser.mage_id}`,
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleUser);

		const response = await subject.getUser(false);

		expect(response).toBeDefined();
		expect(response).toMatchObject(sampleUser);
	});

	test('getUser() with success', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				`/users/${sampleUserSummary.mage_id}?style=summary`,
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleUserSummary);

		const response = await subject.getUser(true);

		expect(response).toBeDefined();
		expect(response).toMatchObject(sampleUserSummary);
	});
});
