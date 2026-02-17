import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CallbackService } from '../../services/CallbackService';
import { EQP } from '../../index';
import { AuthenticatedAdapter } from '../../AuthenticatedAdapter';
import type { EQPStatusUpdateEvent, MalwareScanCompleteEvent } from '../../types';

describe('CallbackService', () => {
	let mockEqp: EQP;
	let mockAdapter: AuthenticatedAdapter;
	let service: CallbackService;

	beforeEach(() => {
		mockAdapter = {
			get: vi.fn(),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			getMageId: vi.fn()
		} as unknown as AuthenticatedAdapter;

		mockEqp = {
			userService: {
				updateUser: vi.fn().mockResolvedValue({ mage_id: 'MAG123' })
			},
			packageService: {
				getPackageBySubmissionId: vi.fn().mockResolvedValue({ submission_id: 'sub-1' })
			},
			fileService: {
				getFile: vi.fn().mockResolvedValue({
					file_upload_id: 'file-1',
					submission_ids: ['sub-1', 'sub-2']
				})
			}
		} as unknown as EQP;

		service = new CallbackService(mockEqp, mockAdapter);
	});

	describe('registerCallback', () => {
		it('should call userService.updateUser with api_callbacks', async () => {
			await service.registerCallback('My Callback', 'https://example.com/cb', 'admin', 'secret');

			expect(mockEqp.userService.updateUser).toHaveBeenCalledWith({
				api_callbacks: [
					{
						name: 'My Callback',
						url: 'https://example.com/cb',
						username: 'admin',
						password: 'secret'
					}
				]
			});
		});
	});

	describe('parseCallback', () => {
		it('should handle eqp_status_update event', async () => {
			const event: EQPStatusUpdateEvent = {
				callback_event: 'eqp_status_update',
				update_info: {
					submission_id: 'sub-1',
					item_id: 'item-1',
					eqp_flow: 'technical',
					eqp_state: 'approved'
				}
			};

			const result = await service.parseCallback(event);

			expect(mockEqp.packageService.getPackageBySubmissionId).toHaveBeenCalledWith('sub-1');
			expect(result).toEqual({
				submission: { submission_id: 'sub-1' },
				status: 'approved',
				flow: 'technical'
			});
		});

		it('should handle malware_scan_complete event', async () => {
			const event: MalwareScanCompleteEvent = {
				callback_event: 'malware_scan_complete',
				update_info: {
					file_upload_id: 'file-1',
					tool_result: 'pass'
				}
			};

			const result = await service.parseCallback(event);

			expect(mockEqp.fileService.getFile).toHaveBeenCalledWith('file-1');
			expect(mockEqp.packageService.getPackageBySubmissionId).toHaveBeenCalledTimes(2);
			expect(mockEqp.packageService.getPackageBySubmissionId).toHaveBeenCalledWith('sub-1');
			expect(mockEqp.packageService.getPackageBySubmissionId).toHaveBeenCalledWith('sub-2');
			expect(result).toEqual({
				file: { file_upload_id: 'file-1', submission_ids: ['sub-1', 'sub-2'] },
				submissions: [{ submission_id: 'sub-1' }, { submission_id: 'sub-1' }],
				result: 'pass'
			});
		});

		it('should throw on unknown callback_event', async () => {
			const event = {
				callback_event: 'unknown_event',
				update_info: {}
			};

			await expect(service.parseCallback(event as never)).rejects.toThrow('unknown callback_event "unknown_event"');
		});
	});
});
