import { EQPStatusUpdateEvent, File, Magento1Key, Magento2Key, MalwareScanCompleteEvent, Package, User, UserSummary } from '../src';

export const sampleFile: File = {
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

export const sampleUser: User = {
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

export const sampleUserSummary: UserSummary = {
	email: '',
	first_name: '',
	last_name: '',
	has_accepted_tos: false,
	has_completed_profile: false,
	mage_id: 'MAGE_ID',
	profile_image_artifact: {
		content_type: '',
		file_hash: '',
		file_upload_id: '',
		filename: '',
		malware_status: '',
		size: 0,
		url: ''
	},
	screen_name: ''
};

export const samplePackage: Package = {
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

export const sampleMalwareScanCompletedEvent: MalwareScanCompleteEvent = {
	callback_event: 'malware_scan_complete',
	update_info: {
		file_upload_id: '0',
		tool_result: 'pass'
	}
};

export const sampleEQPStatusUpdateEvent: EQPStatusUpdateEvent = {
	callback_event: 'eqp_status_update',
	update_info: {
		current_status: 'pass',
		eqp_flow: '',
		item_id: '0',
		submission_id: '0'
	}
};

export const sampleMagento1Key: Magento1Key = {
	product_key: '',
	product_name: 'Magento 1'
};

export const sampleMagento2Key: Magento2Key = {
	is_enabled: true,
	label: 'Magento 2 Sample key',
	password_key: 'blah',
	user_key: 'blah'
};
