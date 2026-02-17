import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PackageService } from '../../services/PackageService';
import { AuthenticatedAdapter } from '../../AuthenticatedAdapter';

describe('PackageService', () => {
	let mockAdapter: AuthenticatedAdapter;
	let service: PackageService;

	beforeEach(() => {
		mockAdapter = {
			get: vi.fn().mockResolvedValue({}),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			getMageId: vi.fn()
		} as unknown as AuthenticatedAdapter;
		service = new PackageService(mockAdapter);
	});

	describe('getPackages', () => {
		it('should GET /products/packages', async () => {
			await service.getPackages();

			expect(mockAdapter.get).toHaveBeenCalledWith('/products/packages');
		});
	});

	describe('getPackageBySubmissionId', () => {
		it('should GET /products/packages/{submissionId}', async () => {
			await service.getPackageBySubmissionId('sub-123');

			expect(mockAdapter.get).toHaveBeenCalledWith('/products/packages/sub-123');
		});
	});

	describe('getPackageByItemId', () => {
		it('should GET /products/packages/items/{itemId}', async () => {
			await service.getPackageByItemId('item-456');

			expect(mockAdapter.get).toHaveBeenCalledWith('/products/packages/items/item-456');
		});
	});
});
