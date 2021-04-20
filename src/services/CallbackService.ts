import { EQP } from '..';
import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { EQPStatusUpdateEvent, MalwareScanCompleteEvent, RawCallbackEvent, User, EQPStatusUpdateInfo, MalwareScanCompleteInfo } from '../types';

export class CallbackService {
	constructor(protected readonly eqp: EQP, protected readonly adapter: AuthenticatedAdapter) {}

	/**
	 * Register a callback.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/callbacks.html#register-a-callback
	 * @example eqp.registerCallback('Local test server', 'https://example.com/callback', 'magento', 'marketplace')
	 */
	registerCallback(name: string, url: string, username: string, password: string): Promise<User> {
		return this.eqp.userService.updateUser({ api_callbacks: [{ name, url, username, password }] });
	}

	/** Parse a callback request body. */
	parseCallback(event: EQPStatusUpdateEvent): Promise<EQPStatusUpdateInfo>;

	/** Parse a callback request body. */
	parseCallback(event: MalwareScanCompleteEvent): Promise<MalwareScanCompleteInfo>;

	async parseCallback(event: RawCallbackEvent): Promise<EQPStatusUpdateInfo | MalwareScanCompleteInfo> {
		switch (event.callback_event) {
			case 'eqp_status_update': {
				const { update_info: updateInfo } = event as EQPStatusUpdateEvent;

				return {
					item: await this.eqp.packageService.getPackageByItemId(updateInfo.item_id),
					submission: await this.eqp.packageService.getPackageBySubmissionId(updateInfo.submission_id),
					status: updateInfo.eqp_state,
					flow: updateInfo.eqp_flow
				};
			}

			case 'malware_scan_complete': {
				const { update_info: updateInfo } = event as MalwareScanCompleteEvent;

				const file = await this.eqp.fileService.getFile(updateInfo.file_upload_id);

				return {
					file,
					submissions: await Promise.all(file.submission_ids.map((id) => this.eqp.packageService.getPackageBySubmissionId(id))),
					result: updateInfo.tool_result
				};
			}

			default:
				throw new Error(`unknown callback_event "${event.callback_event}"`);
		}
	}
}
