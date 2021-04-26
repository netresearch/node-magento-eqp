import MockAdapter from 'axios-mock-adapter/types';
import EQP from '../src';
import { User } from '../src/types';
import { AxiosMockAdapter } from './MockAdapter';

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

		const sampleUser: User = {
			api_callbacks: [],
			company_profile: {
				addresses: [],
				bio: '',
				created_at: '',
				modified_at: '',
				name: '',
				primary_email: '',
				social_media_info: {},
				support_email: '',
				website_url: ''
			},
			email: '',
			first_name: '',
			last_name: '',
			eqp_api: { is_eligible: false, has_credentials: false },
			extension_share_percent: 0,
			has_accepted_tos: false,
			has_completed_profile: false,
			install_share_percent: 0,
			is_company: false,
			locale: '',
			mage_id: 'MAGE_ID',
			partner_level: 0,
			payment_info: '',
			payment_type: 0,
			personal_profile: {
				addresses: [],
				bio: '',
				created_at: '',
				last_logged_in: '',
				modified_at: '',
				social_media_info: [],
				website_url: ''
			},
			privacy_policy_url: '',
			profile_image_artifact: {
				content_type: '',
				file_hash: '',
				file_upload_id: '',
				filename: '',
				malware_status: '',
				size: 0,
				url: ''
			},
			screen_name: '',
			show_extension_workflow: false,
			show_theme_workflow: false,
			support_share_percent: 0,
			tax_review_status: 100,
			tax_withhold_percent: 100,
			taxpayer_type: 0,
			theme_share_percent: 100,
			timezone: '',
			tos_accepted_date: '',
			tos_accepted_version: '',
			vendor_name: ''
		};

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
