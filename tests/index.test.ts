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

		// Already tested in tests/services/UserService.test.ts
		const mageId = await subject.getMageId();

		expect(mageId).toBeDefined();
		expect(mageId).toEqual(sampleUser.mage_id);
	});
});
