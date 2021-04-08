export type Environment = 'staging' | 'production';

export interface Options {
	environment: Environment;
	autoRefresh: boolean;
}

export interface Package {
	item_id: string;
	submission_id: string;
	mage_id: string;
	type: string;
	sku: string;
	url_key: string;
	version: string;
	platform: string;
	name: string;
	short_description: string;
	long_description: string;
	stability: string;
	version_compatibility: {
		edition: string;
		versions: string[];
	}[];
	process_as_patch: string;
	release_notes: string;
	artifact: {
		file_upload_id: string;
		filename: string;
		content_type: string;
		size: number;
		file_hash: string;
		malware_status: string;
	};
	launch_on_approval: boolean;
	requested_launch_date: string;
	original_launch_date?: string;
	latest_launch_date: string;
	max_version_launched: any[];
	documentation_artifacts: {
		user: any[];
		installation: any[];
		reference: any[];
	};
	shared_packages: any[];
	categories: string[];
	media_artifacts: {
		icon_image: any[];
		gallery_images: {
			file_upload_id: string;
			filename: string;
			content_type: string;
			url: string;
			size: number;
			file_hash: string;
			malware_status: string;
		}[];
		video_urls: any[];
	};
	browsers: any[];
	browser_os_compatibility: any[];
	prices: {
		currency_code: string;
		edition: string;
		price: number;
	}[];
	support_tiers: any[];
	license_type: string;
	custom_license_name: string;
	custom_license_url: string;
	external_services: {
		is_saas: boolean;
		items: any[];
	};
	marketing_options: {
		released_with_setup_scripts: boolean;
		included_service_contracts: boolean;
		included_external_service_contracts: boolean;
		custom_implementation_ui: boolean;
		support_web_api: boolean;
		support_test_coverage: boolean;
		support_responsive_design: boolean;
	};
	technical_options: {
		page_builder_new_content_type: boolean;
		page_builder_extends_content_type: boolean;
		page_builder_used_for_content_creation: boolean;
	};
	eqp_status: {
		overall: string;
		technical: string;
		marketing: string;
	};
	actions_now_available: {
		overall: any[];
		technical: any[];
		marketing: any[];
	};
	submission_counts: {
		technical_submission_count: number;
		marketing_submission_count: number;
		marketing_live_update_count: number;
	};
	created_at: string;
	modified_at: string;
}

export interface APICallback {
	name: string;
	url: string;
	username: string;
	password: string;
}

export interface User {
	mage_id: string;
	first_name: string;
	last_name: string;
	email: string;
	screen_name: string;
	has_completed_profile: boolean;
	has_accepted_tos: boolean;
	profile_image_artifact: {
		file_upload_id: string;
		filename: string;
		content_type: string;
		url: string;
		size: number;
		file_hash: string;
		malware_status: string;
	};
	tos_accepted_version: string;
	tos_accepted_date: string;
	is_company: boolean;
	vendor_name: string;
	partner_level: number;
	locale: string;
	timezone: string;
	payment_info: string;
	payment_type: number;
	taxpayer_type: number;
	tax_review_status: number;
	tax_withhold_percent: number;
	extension_share_percent: number;
	theme_share_percent: number;
	install_share_percent: number;
	support_share_percent: number;
	show_extension_workflow: boolean;
	show_theme_workflow: boolean;
	privacy_policy_url: string;
	api_callbacks: APICallback[];
	eqp_api: {
		is_eligible: boolean;
		has_credentials: boolean;
	};
	personal_profile: {
		bio: string;
		website_url: string;
		last_logged_in: string;
		created_at: string;
		modified_at: string;
		social_media_info: any[];
		addresses: any[];
	};
	company_profile: {
		name: string;
		bio: string;
		website_url: string;
		primary_email: string;
		support_email: string;
		created_at: string;
		modified_at: string;
		social_media_info: {
			twitter?: string;
			stackexchange_url?: string;
			facebook_url?: string;
			linkedin_url?: string;
			github_username?: string;
		};
		addresses: {
			address_key: number;
			address_line_1: string;
			apt_suite_other: string;
			address_line_2: string;
			city: string;
			state: string;
			country: string;
			postal_code: string;
			phone: string;
			is_primary: boolean;
		}[];
	};
}

export interface UserSummary {
	mage_id: string;
	first_name: string;
	last_name: string;
	email: string;
	screen_name: string;
	has_completed_profile: boolean;
	has_accepted_tos: boolean;
	profile_image_artifact: {
		file_upload_id: string;
		filename: string;
		content_type: string;
		url: string;
		size: number;
		file_hash: string;
		malware_status: string;
	};
}

export interface File {
	file_upload_id: string;
	filename: string;
	content_type: string;
	size: number;
	malware_status: string;
	file_hash: string;
	submission_ids: string[];
	is_profile_image: boolean;
	url: string;
}

export interface RawCallbackEvent {
	callback_event: string;
	update_info: unknown;
}

export interface MalwareScanCompleteEvent extends RawCallbackEvent {
	callback_event: 'malware_scan_complete';
	update_info: {
		file_upload_id: string;
		tool_result: string;
	};
}

export interface EQPStatusUpdateEvent extends RawCallbackEvent {
	callback_event: 'eqp_status_update';
	update_info: {
		submission_id: string;
		item_id: string;
		eqp_flow: string;
		current_status: string;
	};
}

export interface Magento1Key {
	product_name: string;
	product_key: string;
}

export interface Magento2Key {
	label: string;
	user_key: string;
	password_key: string;
	is_enabled: boolean;
}
