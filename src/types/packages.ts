import { File } from './common';

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
	artifact: Omit<File, 'is_profile_image' | 'submission_ids'>;
	launch_on_approval: boolean;
	requested_launch_date: string;
	original_launch_date?: string;
	latest_launch_date: string;
	max_version_launched: unknown[];
	documentation_artifacts: {
		user: unknown[];
		installation: unknown[];
		reference: unknown[];
	};
	shared_packages: unknown[];
	categories: string[];
	media_artifacts: {
		icon_image: unknown[];
		gallery_images: Omit<File, 'is_profile_image' | 'submission_ids'>[];
		video_urls: unknown[];
	};
	browsers: unknown[];
	browser_os_compatibility: unknown[];
	prices: {
		currency_code: string;
		edition: string;
		price: number;
	}[];
	support_tiers: unknown[];
	license_type: string;
	custom_license_name: string;
	custom_license_url: string;
	external_services: {
		is_saas: boolean;
		items: unknown[];
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
		overall: unknown[];
		technical: unknown[];
		marketing: unknown[];
	};
	submission_counts: {
		technical_submission_count: number;
		marketing_submission_count: number;
		marketing_live_update_count: number;
	};
	created_at: string;
	modified_at: string;
}
