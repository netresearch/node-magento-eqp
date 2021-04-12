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

export interface APICallback {
	name: string;
	url: string;
	username: string;
	password: string;
}
