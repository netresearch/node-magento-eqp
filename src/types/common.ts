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
