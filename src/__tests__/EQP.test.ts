import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EQP } from '../index';
import { FileService } from '../services/FileService';
import { UserService } from '../services/UserService';
import { KeyService } from '../services/KeyService';
import { CallbackService } from '../services/CallbackService';
import { ReportService } from '../services/ReportService';
import { PackageService } from '../services/PackageService';

// Mock global fetch to prevent real requests during EQP construction
vi.stubGlobal('fetch', vi.fn());

describe('EQP', () => {
	const defaultOptions = {
		appId: 'test-app-id',
		appSecret: 'test-app-secret'
	};

	describe('environment URLs', () => {
		it('should use production URL by default', () => {
			const eqp = new EQP(defaultOptions);

			expect(eqp).toBeDefined();
		});

		it('should use production URL when environment is "production"', () => {
			const eqp = new EQP({ ...defaultOptions, environment: 'production' });

			expect(eqp).toBeDefined();
		});

		it('should use sandbox URL when environment is "sandbox"', () => {
			const eqp = new EQP({ ...defaultOptions, environment: 'sandbox' });

			expect(eqp).toBeDefined();
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

			const eqp = new EQP({ ...defaultOptions, adapter: customAdapter });

			expect(eqp).toBeDefined();
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
