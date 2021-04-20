import MockAdapter from 'axios-mock-adapter/types';
import { AuthenticatedAdapter } from '../src/AuthenticatedAdapter';
import { AxiosMockAdapter } from './MockAdapter';

describe('AuthenticatedAdapter', () => {
	const mock = new AxiosMockAdapter('http://localhost');

	const mockAuth = (mock: MockAdapter) => {
		mock.onPost('/app/session/token', {
			grant_type: 'session',
			expires_in: 7200
		}).reply(async (config) => {
			if (config.auth) {
				return [200, { ust: 'TOKEN', expires_in: 7200, mage_id: 'MAGE_ID' }];
			}

			return [400];
		});
	};

	const subject = new AuthenticatedAdapter(mock, {
		appSecret: 'pass',
		appId: 'id'
	});

	test('GET requests', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				'/test',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, {});

		const response = await subject.get('/test');

		expect(response).toBeDefined();
		expect(response).toMatchObject({});
	});

	test('POST requests', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onPost(
				'/test',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, {});

		const response = await subject.post('/test', {});

		expect(response).toBeDefined();
		expect(response).toMatchObject({});
	});

	test('PUT requests', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onPut(
				'/test',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, {});

		const response = await subject.put('/test', {});

		expect(response).toBeDefined();
		expect(response).toMatchObject({});
	});

	test('DELETE requests', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onDelete(
				'/test',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, {});

		const response = await subject.delete('/test');

		expect(response).toBeDefined();
		expect(response).toMatchObject({});
	});

	test("Get's the Mage ID", async () => {
		mockAuth(mock.mockAdapter);

		const response = await subject.getMageId();

		expect(response).toBeDefined();
		expect(response).toMatch('MAGE_ID');
	});
});
