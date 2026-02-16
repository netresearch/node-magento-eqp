import { FetchAdapter } from './FetchAdapter';
import { AuthenticatedAdapter } from './AuthenticatedAdapter';
import { CallbackService } from './services/CallbackService';
import { FileService } from './services/FileService';
import { KeyService } from './services/KeyService';
import { PackageService } from './services/PackageService';
import { ReportService } from './services/ReportService';
import { UserService } from './services/UserService';
import { EQPOptions } from './types/options';

export { FetchAdapter } from './FetchAdapter';
export { HttpError } from './HttpError';
export { AuthenticatedAdapter } from './AuthenticatedAdapter';
export * from './services';
export * from './types';

export class EQP {
	protected adapter: AuthenticatedAdapter;

	readonly fileService: FileService;
	readonly userService: UserService;
	readonly keyService: KeyService;
	readonly callbackService: CallbackService;
	readonly reportService: ReportService;
	readonly packageService: PackageService;

	/**
	 * Fetch the user's Mage ID
	 * @see https://developer.adobe.com/commerce/marketplace/guides/eqp/v1/auth/#authentication-and-authorization-flow
	 */
	getMageId() {
		return this.adapter.getMageId();
	}

	constructor(options: EQPOptions) {
		options.environment ??= 'production';

		this.adapter = new AuthenticatedAdapter(
			options.adapter ?? new FetchAdapter(`https://commercedeveloper${options.environment === 'sandbox' ? '-sandbox' : ''}-api.adobe.com/rest/v1`),
			{
				appId: options.appId,
				appSecret: options.appSecret
			}
		);

		this.fileService = new FileService(this.adapter);
		this.userService = new UserService(this.adapter);
		this.keyService = new KeyService(this.adapter);
		this.callbackService = new CallbackService(this, this.adapter);
		this.reportService = new ReportService(this.adapter);
		this.packageService = new PackageService(this.adapter);
	}
}

export default EQP;
