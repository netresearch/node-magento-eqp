export type Environment = 'staging' | 'production';

export interface EQPOptions {
	environment: Environment;
	autoRefresh: boolean;
}
