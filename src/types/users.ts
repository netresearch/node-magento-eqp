import { APICallback } from './callbacks';
import { File } from './packages';

export interface User {
	mage_id: string;
	first_name: string;
	last_name: string;
	email: string;
	screen_name: string;
	has_completed_profile: boolean;
	has_accepted_tos: boolean;
	profile_image_artifact: Omit<File, 'is_profile_image' | 'submission_ids'>;
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
	profile_image_artifact: Omit<File, 'is_profile_image' | 'submission_ids'>;
}
