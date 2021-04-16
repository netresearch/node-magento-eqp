import { EQP } from '.';
import { EQPStatusUpdateEvent, File, MalwareScanCompleteEvent, Package, RawCallbackEvent } from './types';

export async function parseCallback(
	eqp: EQP,
	event: RawCallbackEvent
): Promise<{ item: Package; submission: Package; status: string; flow: string } | { file: File; submissions: Package[]; result: string }> {
	switch (event.callback_event) {
		case 'eqp_status_update': {
			const { update_info: updateInfo } = event as EQPStatusUpdateEvent;

			return {
				item: await eqp.getPackageByItemId(updateInfo.item_id),
				submission: await eqp.getPackageBySubmissionId(updateInfo.submission_id),
				status: updateInfo.current_status,
				flow: updateInfo.eqp_flow
			};
		}

		case 'malware_scan_complete': {
			const { update_info: updateInfo } = event as MalwareScanCompleteEvent;

			const file = await eqp.getFile(updateInfo.file_upload_id);

			return {
				file,
				submissions: await Promise.all(file.submission_ids.map((id) => eqp.getPackageBySubmissionId(id))),
				result: updateInfo.tool_result
			};
		}

		default:
			throw new Error(`unknown callback_event "${event.callback_event}"`);
	}
}
