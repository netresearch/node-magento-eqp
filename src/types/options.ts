import { Adapter } from './adapters';

export type Environment = 'sandbox' | 'production';

export interface EQPOptions {
	environment?: Environment;
	autoRefresh?: boolean;

	appId: string;
	appSecret: string;
	expiresIn?: number;

	adapter?: Adapter;
}
