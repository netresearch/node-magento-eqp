import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EQP } from '../index';
import { FetchAdapter } from '../FetchAdapter';
import { FileService } from '../services/FileService';
import { UserService } from '../services/UserService';
import { KeyService } from '../services/KeyService';
import { CallbackService } from '../services/CallbackService';
import { ReportService } from '../services/ReportService';
import { PackageService } from '../services/PackageService';

vi.mock('../FetchAdapter', () => ({
	FetchAdapter: vi.fn()
}));

describe('EQP', () => {
	const defaultOptions = {
		appId: 'test-app-id',
		appSecret: 'test-app-secret'
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('environment URLs', () => {
		it('should use production URL by default', () => {
			new EQP(defaultOptions);

			expect(FetchAdapter).toHaveBeenCalledWith('https://commercedeveloper-api.adobe.com/rest/v1');
		});

		it('should use production URL when environment is "production"', () => {
			new EQP({ ...defaultOptions, environment: 'production' });

			expect(FetchAdapter).toHaveBeenCalledWith('https://commercedeveloper-api.adobe.com/rest/v1');
		});

		it('should use sandbox URL when environment is "sandbox"', () => {
			new EQP({ ...defaultOptions, environment: 'sandbox' });

			expect(FetchAdapter).toHaveBeenCalledWith('https://commercedeveloper-sandbox-api.adobe.com/rest/v1');
		});
	});

	describe('custom adapter', () => {
		it('should use provided adapter instead of creating FetchAdapter', () => {
			const customAdapter = {
				setHeader: vi.fn(),
				get: vi.fn(),
				post: vi.fn(),
				put: vi.fn(),
				delete: vi.fn()
			};

			new EQP({ ...defaultOptions, adapter: customAdapter });

			expect(FetchAdapter).not.toHaveBeenCalled();
		});
	});

	describe('services', () => {
		let eqp: EQP;

		beforeEach(() => {
			eqp = new EQP(defaultOptions);
		});

		it('should initialize fileService', () => {
			expect(eqp.fileService).toBeInstanceOf(FileService);
		});

		it('should initialize userService', () => {
			expect(eqp.userService).toBeInstanceOf(UserService);
		});

		it('should initialize keyService', () => {
			expect(eqp.keyService).toBeInstanceOf(KeyService);
		});

		it('should initialize callbackService', () => {
			expect(eqp.callbackService).toBeInstanceOf(CallbackService);
		});

		it('should initialize reportService', () => {
			expect(eqp.reportService).toBeInstanceOf(ReportService);
		});

		it('should initialize packageService', () => {
			expect(eqp.packageService).toBeInstanceOf(PackageService);
		});
	});

	describe('getMageId', () => {
		it('should delegate to adapter.getMageId()', async () => {
			const customAdapter = {
				setHeader: vi.fn(),
				get: vi.fn(),
				post: vi.fn().mockResolvedValue({ mage_id: 'MAG456', ust: 'token', expires_in: 360 }),
				put: vi.fn(),
				delete: vi.fn()
			};

			const eqp = new EQP({ ...defaultOptions, adapter: customAdapter });
			const mageId = await eqp.getMageId();

			expect(mageId).toBe('MAG456');
		});
	});
});
