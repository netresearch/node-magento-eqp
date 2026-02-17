import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../services/UserService';
import { AuthenticatedAdapter } from '../../AuthenticatedAdapter';

describe('UserService', () => {
	let mockAdapter: AuthenticatedAdapter;
	let service: UserService;

	beforeEach(() => {
		mockAdapter = {
			get: vi.fn().mockResolvedValue({}),
			post: vi.fn(),
			put: vi.fn().mockResolvedValue({}),
			delete: vi.fn(),
			getMageId: vi.fn()
		} as unknown as AuthenticatedAdapter;
		service = new UserService(mockAdapter);
	});

	describe('getUser', () => {
		it('should GET /users/|MAGE_ID| when summary is false', async () => {
			await service.getUser(false);

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|');
		});

		it('should GET /users/|MAGE_ID|?style=summary when summary is true', async () => {
			await service.getUser(true);

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|?style=summary');
		});

		it('should default summary to false', async () => {
			await service.getUser(false);

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|');
		});
	});

	describe('updateUser', () => {
		it('should PUT to /users/|MAGE_ID| with action: submit default', async () => {
			await service.updateUser({ personal_profile: { bio: 'test' } } as never);

			expect(mockAdapter.put).toHaveBeenCalledWith('/users/|MAGE_ID|', {
				action: 'submit',
				personal_profile: { bio: 'test' }
			});
		});

		it('should allow overriding action via spread', async () => {
			await service.updateUser({ action: 'draft' });

			expect(mockAdapter.put).toHaveBeenCalledWith('/users/|MAGE_ID|', {
				action: 'draft'
			});
		});
	});
});
