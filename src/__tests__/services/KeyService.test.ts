import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KeyService } from '../../services/KeyService';
import { AuthenticatedAdapter } from '../../AuthenticatedAdapter';

describe('KeyService', () => {
	let mockAdapter: AuthenticatedAdapter;
	let service: KeyService;

	beforeEach(() => {
		mockAdapter = {
			get: vi.fn().mockResolvedValue({}),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			getMageId: vi.fn()
		} as unknown as AuthenticatedAdapter;
		service = new KeyService(mockAdapter);
	});

	describe('getKeys', () => {
		it('should GET /users/|MAGE_ID|/keys with type=all', async () => {
			await service.getKeys({ type: 'all' });

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/keys', {
				params: { type: 'all', label: undefined }
			});
		});

		it('should GET with type=m1', async () => {
			await service.getKeys({ type: 'm1' });

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/keys', {
				params: { type: 'm1', label: undefined }
			});
		});

		it('should GET with type=m2', async () => {
			await service.getKeys({ type: 'm2' });

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/keys', {
				params: { type: 'm2', label: undefined }
			});
		});

		it('should pass optional label param', async () => {
			await service.getKeys({ type: 'all', label: 'testing' });

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/keys', {
				params: { type: 'all', label: 'testing' }
			});
		});
	});
});
