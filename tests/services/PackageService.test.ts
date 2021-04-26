import MockAdapter from 'axios-mock-adapter/types';
import { AuthenticatedAdapter, Package, PackageService } from '../../src';
import { AxiosMockAdapter } from '../MockAdapter';

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

		const sampleSubmission: Package = {
			actions_now_available: {
				marketing: [],
				overall: [],
				technical: []
			},
			artifact: {
				content_type: '',
				file_hash: '',
				file_upload_id: '',
				filename: '',
				malware_status: '',
				size: 0,
				url: ''
			},
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

		mock.mockAdapter
			.onGet(
				'/products/packages',
				undefined,
				expect.objectContaining({
					Authorization: expect.stringMatching('Bearer TOKEN')
				})
			)
			.reply(200, [sampleSubmission]);

		const response = await subject.getPackages();

		expect(response).toBeDefined();
		expect(response).toEqual(expect.arrayContaining([sampleSubmission]));
	});
});
