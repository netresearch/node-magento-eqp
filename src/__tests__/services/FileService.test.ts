import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileService } from '../../services/FileService';
import { AuthenticatedAdapter } from '../../AuthenticatedAdapter';

describe('FileService', () => {
	let mockAdapter: AuthenticatedAdapter;
	let service: FileService;

	beforeEach(() => {
		mockAdapter = {
			get: vi.fn().mockResolvedValue({}),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			getMageId: vi.fn()
		} as unknown as AuthenticatedAdapter;
		service = new FileService(mockAdapter);
	});

	describe('getFile', () => {
		it('should GET /files/uploads/{uploadId}', async () => {
			await service.getFile('upload-123');

			expect(mockAdapter.get).toHaveBeenCalledWith('/files/uploads/upload-123', {
				params: { offset: undefined, limit: undefined }
			});
		});

		it('should pass offset and limit params', async () => {
			await service.getFile('upload-123', 10, 50);

			expect(mockAdapter.get).toHaveBeenCalledWith('/files/uploads/upload-123', {
				params: { offset: 10, limit: 50 }
			});
		});

		it('should pass only offset when limit is not provided', async () => {
			await service.getFile('upload-123', 5);

			expect(mockAdapter.get).toHaveBeenCalledWith('/files/uploads/upload-123', {
				params: { offset: 5, limit: undefined }
			});
		});
	});
});
