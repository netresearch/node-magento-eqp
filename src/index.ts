import { AxiosAdapter } from './Adapters';
import { AuthenticatedAdapter } from './AuthenticatedAdapter';
import { CallbackService } from './services/CallbackService';
import { FileService } from './services/FileService';
import { KeyService } from './services/KeyService';
import { PackageService } from './services/PackageService';
import { ReportService } from './services/ReportService';
import { UserService } from './services/UserService';
import { EQPOptions } from './types/options';

export { AxiosAdapter } from './Adapters';
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

	/** The authenticated user's Magento ID */
	get mageId(): string | undefined {
		return this.adapter.mageId;
	}

	constructor(options: EQPOptions) {
		this.adapter = new AuthenticatedAdapter(
			options.adapter ??
				new AxiosAdapter(`https://developer${(options.environment ?? 'production') === 'staging' ? '-stg' : ''}-api.magento.com/rest/v1`),
			{
				appId: options.appId,
				appSecret: options.appSecret,
				autoRefresh: options.autoRefresh ?? false,
				tokenTTL: options.expiresIn
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
