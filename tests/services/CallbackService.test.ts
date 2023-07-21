import MockAdapter from 'axios-mock-adapter/types';
import EQP, { RawCallbackEvent } from '../../src';
import { AxiosMockAdapter } from '../MockAdapter';
import { sampleEQPStatusUpdateEvent, sampleFile, sampleMalwareScanCompletedEvent, samplePackage } from '../mocks';

describe('CallbackService', () => {
	const mock = new AxiosMockAdapter('http://localhost');

	const mockAuth = (mock: MockAdapter) => {
		mock.onPost('/app/session/token', {
			grant_type: 'session',
			expires_in: 7200
		}).reply(200, { ust: 'TOKEN', expires_in: 7200, mage_id: 'MAGE_ID' });
	};

	const eqp = new EQP({
		appSecret: 'pass',
		appId: 'id',
		adapter: mock
	});

	const subject = eqp.callbackService;

	test('registerCallback() with success', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onPut(
				'/users/MAGE_ID',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, {});

		const response = await subject.registerCallback('test', 'test', 'test', 'test');

		expect(response).toBeDefined();
	});

	test('parseCallback() with MalwareScanCompletedEvent', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				'/files/uploads/0',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleFile);

		mock.mockAdapter
			.onGet(
				'/products/packages/0',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, samplePackage);

		const response = await subject.parseCallback(sampleMalwareScanCompletedEvent);

		expect(response).toBeDefined();
		expect(response.file).toEqual(sampleFile);
		expect(response.submissions).toEqual(expect.arrayContaining([samplePackage]));
	});

	test('parseCallback() with EQPStatusUpdateEvent', async () => {
		mockAuth(mock.mockAdapter);

		mock.mockAdapter
			.onGet(
				'/products/packages/items/0',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, samplePackage);

		mock.mockAdapter
			.onGet(
				'/products/packages/0',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, samplePackage);

		const response = await subject.parseCallback(sampleEQPStatusUpdateEvent);

		expect(response).toBeDefined();
		expect(response.flow).toEqual('');
		expect(response.submission).toMatchObject(samplePackage);
	});

	test('parseCallback() with unknown event', async () => {
		mockAuth(mock.mockAdapter);

		expect.assertions(1);

		const sampleCallback: RawCallbackEvent = {
			callback_event: 'unknown',
			update_info: {}
		};

		// TypeScript doesn't find matching overloads here, so we just gotta @ts-ignore our way through here
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore

		return subject.parseCallback(sampleCallback).catch((e) => expect(e.message).toMatch(`unknown callback_event "${sampleCallback.callback_event}"`));
	});
});
