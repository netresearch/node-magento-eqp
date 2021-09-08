import MockAdapter from 'axios-mock-adapter/types';
import { AuthenticatedAdapter } from '../../src/AuthenticatedAdapter';
import { FileService } from '../../src/services/FileService';
import { File } from '../../src/types';
import { AxiosMockAdapter } from '../MockAdapter';
import { sampleFile } from '../mocks';

describe('FileService', () => {
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

	const subject = new FileService(authAdapter);

	test('getFile() with success', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				'/files/uploads/someId',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleFile);

		const response = await subject.getFile('someId');

		expect(response).toBeDefined();
		expect(response).toMatchObject<File>(sampleFile);
	});

	test('getFile() with error', async () => {
		mockAuth(mock.mockAdapter);

		try {
			mock.mockAdapter
				.onGet(
					'/files/uploads/someId',
					undefined,
					expect.objectContaining({
						Authorization: expect.stringMatching('Bearer TOKEN')
					})
				)
				.reply(400, {
					code: 1208,
					message: 'Insufficient information for Technical Submission'
				});

			await subject.getFile('someId');
		} catch (e) {
			expect((e as Error).toString()).toMatch('Error: Request failed with status code 400');
		}
	});
});
