import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportService } from '../../services/ReportService';
import { AuthenticatedAdapter } from '../../AuthenticatedAdapter';

describe('ReportService', () => {
	let mockAdapter: AuthenticatedAdapter;
	let service: ReportService;

	beforeEach(() => {
		mockAdapter = {
			get: vi.fn().mockResolvedValue({}),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
			getMageId: vi.fn()
		} as unknown as AuthenticatedAdapter;
		service = new ReportService(mockAdapter);
	});

	describe('getPageviewReports', () => {
		it('should GET /users/|MAGE_ID|/reports/pageviews', async () => {
			await service.getPageviewReports();

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/reports/pageviews');
		});
	});

	describe('getTotalReports', () => {
		it('should GET /users/|MAGE_ID|/reports/totals', async () => {
			await service.getTotalReports();

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/reports/totals');
		});
	});

	describe('getSalesReports', () => {
		it('should GET /users/|MAGE_ID|/reports/pageviews (documents bug: same endpoint as pageviews)', async () => {
			await service.getSalesReports();

			// NOTE: This documents a bug - getSalesReports uses the same URL as getPageviewReports
			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/reports/pageviews');
		});
	});

	describe('getRefundReports', () => {
		it('should GET /users/|MAGE_ID|/reports/refunds', async () => {
			await service.getRefundReports();

			expect(mockAdapter.get).toHaveBeenCalledWith('/users/|MAGE_ID|/reports/refunds');
		});
	});

	describe('getReports', () => {
		it('should GET /reports/metrics/{metricName}', async () => {
			await service.getReports('downloads');

			expect(mockAdapter.get).toHaveBeenCalledWith('/reports/metrics/downloads');
		});

		it('should GET /reports/metrics/ when no metricName provided', async () => {
			await service.getReports();

			expect(mockAdapter.get).toHaveBeenCalledWith('/reports/metrics/');
		});
	});
});
