import MockAdapter from 'axios-mock-adapter/types';
import EQP, { EQPStatusUpdateEvent, File, MalwareScanCompleteEvent, Package, RawCallbackEvent } from '../../src';
import { AxiosMockAdapter } from '../MockAdapter';

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

		const sampleFile: File = {
			content_type: '',
			file_hash: '',
			file_upload_id: '0',
			filename: '',
			is_profile_image: false,
			malware_status: 'pass',
			size: 0,
			submission_ids: ['0'],
			url: ''
		};

		const sampleSubmission: Package = {
			actions_now_available: {
				marketing: [],
				overall: [],
				technical: []
			},
			artifact: sampleFile,
			browser_os_compatibility: [],
			browsers: [],
			categories: [],
			created_at: '',
			custom_license_name: '',
			custom_license_url: '',
			documentation_artifacts: {
				user: [],
				installation: [],
				reference: []
			},
			eqp_status: {
				marketing: '',
				overall: '',
				technical: ''
			},
			external_services: {
				is_saas: false,
				items: []
			},
			item_id: '0',
			latest_launch_date: '',
			launch_on_approval: true,
			license_type: '',
			long_description: '',
			mage_id: 'MAGE_ID',
			marketing_options: {
				custom_implementation_ui: false,
				included_external_service_contracts: false,
				included_service_contracts: false,
				released_with_setup_scripts: false,
				support_responsive_design: false,
				support_test_coverage: false,
				support_web_api: false
			},
			max_version_launched: [],
			media_artifacts: {
				gallery_images: [],
				icon_image: [],
				video_urls: []
			},
			modified_at: '',
			name: '',
			platform: '',
			prices: [],
			process_as_patch: '',
			release_notes: '',
			requested_launch_date: '',
			shared_packages: [],
			short_description: '',
			sku: '',
			stability: '',
			submission_counts: {
				marketing_live_update_count: 0,
				marketing_submission_count: 0,
				technical_submission_count: 0
			},
			submission_id: '0',
			support_tiers: [],
			technical_options: {
				page_builder_extends_content_type: false,
				page_builder_new_content_type: false,
				page_builder_used_for_content_creation: false
			},
			type: '',
			url_key: '',
			version: '',
			version_compatibility: [],
			original_launch_date: ''
		};

		const sampleMalwareScanCompletedEvent: MalwareScanCompleteEvent = {
			callback_event: 'malware_scan_complete',
			update_info: {
				file_upload_id: '0',
				tool_result: 'pass'
			}
		};

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
			.reply(200, sampleSubmission);

		const response = await subject.parseCallback(sampleMalwareScanCompletedEvent);

		expect(response).toBeDefined();
		expect(response.file).toEqual(sampleFile);
		expect(response.submissions).toEqual(expect.arrayContaining([sampleSubmission]));
	});

	test('parseCallback() with EQPStatusUpdateEvent', async () => {
		mockAuth(mock.mockAdapter);

		const sampleFile: File = {
			content_type: '',
			file_hash: '',
			file_upload_id: '0',
			filename: '',
			is_profile_image: false,
			malware_status: 'pass',
			size: 0,
			submission_ids: ['0'],
			url: ''
		};

		const sampleSubmission: Package = {
			actions_now_available: {
				marketing: [],
				overall: [],
				technical: []
			},
			artifact: sampleFile,
			browser_os_compatibility: [],
			browsers: [],
			categories: [],
			created_at: '',
			custom_license_name: '',
			custom_license_url: '',
			documentation_artifacts: {
				user: [],
				installation: [],
				reference: []
			},
			eqp_status: {
				marketing: '',
				overall: '',
				technical: ''
			},
			external_services: {
				is_saas: false,
				items: []
			},
			item_id: '0',
			latest_launch_date: '',
			launch_on_approval: true,
			license_type: '',
			long_description: '',
			mage_id: 'MAGE_ID',
			marketing_options: {
				custom_implementation_ui: false,
				included_external_service_contracts: false,
				included_service_contracts: false,
				released_with_setup_scripts: false,
				support_responsive_design: false,
				support_test_coverage: false,
				support_web_api: false
			},
			max_version_launched: [],
			media_artifacts: {
				gallery_images: [],
				icon_image: [],
				video_urls: []
			},
			modified_at: '',
			name: '',
			platform: '',
			prices: [],
			process_as_patch: '',
			release_notes: '',
			requested_launch_date: '',
			shared_packages: [],
			short_description: '',
			sku: '',
			stability: '',
			submission_counts: {
				marketing_live_update_count: 0,
				marketing_submission_count: 0,
				technical_submission_count: 0
			},
			submission_id: '0',
			support_tiers: [],
			technical_options: {
				page_builder_extends_content_type: false,
				page_builder_new_content_type: false,
				page_builder_used_for_content_creation: false
			},
			type: '',
			url_key: '',
			version: '',
			version_compatibility: [],
			original_launch_date: ''
		};

		const sampleEQPStatusUpdateEvent: EQPStatusUpdateEvent = {
			callback_event: 'eqp_status_update',
			update_info: {
				current_status: 'pass',
				eqp_flow: '',
				item_id: '0',
				submission_id: '0'
			}
		};

		mock.mockAdapter
			.onGet(
				'/products/packages/items/0',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleSubmission);

		mock.mockAdapter
			.onGet(
				'/products/packages/0',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, sampleSubmission);

		const response = await subject.parseCallback(sampleEQPStatusUpdateEvent);

		expect(response).toBeDefined();
		expect(response.flow).toEqual('');
		expect(response.item).toMatchObject(sampleSubmission);
		expect(response.submission).toMatchObject(sampleSubmission);
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
