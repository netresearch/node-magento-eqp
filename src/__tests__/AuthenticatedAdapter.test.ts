import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { Adapter } from '../types/adapters';

describe('AuthenticatedAdapter', () => {
	let mockBaseAdapter: Adapter;
	let adapter: AuthenticatedAdapter;
	const credentials = { appId: 'test-app-id', appSecret: 'test-app-secret' };

	beforeEach(() => {
		mockBaseAdapter = {
			setHeader: vi.fn(),
			get: vi.fn().mockResolvedValue({}),
			post: vi.fn().mockResolvedValue({
				mage_id: 'MAG123',
				ust: 'test-token-xyz',
				expires_in: 360
			}),
			put: vi.fn().mockResolvedValue({}),
			delete: vi.fn().mockResolvedValue({})
		};
		adapter = new AuthenticatedAdapter(mockBaseAdapter, credentials);
	});

	describe('authenticate', () => {
		it('should POST to /app/session/token with Basic auth', async () => {
			await adapter.get('/test');

			expect(mockBaseAdapter.post).toHaveBeenCalledWith(
				'/app/session/token',
				{ grant_type: 'session', expires_in: 360 },
				{
					auth: {
						username: 'test-app-id',
						password: 'test-app-secret'
					}
				}
			);
		});
	});

	describe('Bearer token', () => {
		it('should pass Bearer token in authorization header', async () => {
			await adapter.get('/test');

			expect(mockBaseAdapter.get).toHaveBeenCalledWith('/test', { headers: { authorization: 'Bearer test-token-xyz' } });
		});
	});

	describe('|MAGE_ID| replacement', () => {
		it('should replace |MAGE_ID| in URLs', async () => {
			await adapter.get('/users/|MAGE_ID|/profile');

			expect(mockBaseAdapter.get).toHaveBeenCalledWith('/users/MAG123/profile', expect.any(Object));
		});

		it('should replace |MAGE_ID| for POST requests', async () => {
			await adapter.post('/users/|MAGE_ID|', { data: 'test' });

			expect(mockBaseAdapter.post).toHaveBeenCalledTimes(2); // 1 auth + 1 actual
			const actualCall = (mockBaseAdapter.post as ReturnType<typeof vi.fn>).mock.calls[1];
			expect(actualCall[0]).toBe('/users/MAG123');
		});

		it('should replace |MAGE_ID| for PUT requests', async () => {
			await adapter.put('/users/|MAGE_ID|', { data: 'test' });

			expect(mockBaseAdapter.put).toHaveBeenCalledWith('/users/MAG123', { data: 'test' }, expect.any(Object));
		});

		it('should replace |MAGE_ID| for DELETE requests', async () => {
			await adapter.delete('/users/|MAGE_ID|/key');

			expect(mockBaseAdapter.delete).toHaveBeenCalledWith('/users/MAG123/key', expect.any(Object));
		});
	});

	describe('addHeaders', () => {
		it('should merge auth headers with existing config headers', async () => {
			await adapter.get('/test', { headers: { 'x-custom': 'value' } });

			expect(mockBaseAdapter.get).toHaveBeenCalledWith('/test', {
				headers: {
					'x-custom': 'value',
					authorization: 'Bearer test-token-xyz'
				}
			});
		});

		it('should work when config is undefined', async () => {
			await adapter.get('/test');

			expect(mockBaseAdapter.get).toHaveBeenCalledWith('/test', { headers: { authorization: 'Bearer test-token-xyz' } });
		});
	});

	describe('HTTP method delegation', () => {
		it('should delegate get', async () => {
			await adapter.get('/path', { params: { a: '1' } });

			expect(mockBaseAdapter.get).toHaveBeenCalledWith(
				'/path',
				expect.objectContaining({
					params: { a: '1' },
					headers: expect.objectContaining({ authorization: 'Bearer test-token-xyz' })
				})
			);
		});

		it('should delegate post', async () => {
			await adapter.post('/path', { body: true });

			const calls = (mockBaseAdapter.post as ReturnType<typeof vi.fn>).mock.calls;
			const actualCall = calls[calls.length - 1];
			expect(actualCall[0]).toBe('/path');
			expect(actualCall[1]).toEqual({ body: true });
		});

		it('should delegate put', async () => {
			await adapter.put('/path', { body: true });

			expect(mockBaseAdapter.put).toHaveBeenCalledWith(
				'/path',
				{ body: true },
				expect.objectContaining({
					headers: expect.objectContaining({ authorization: 'Bearer test-token-xyz' })
				})
			);
		});

		it('should delegate delete', async () => {
			await adapter.delete('/path');

			expect(mockBaseAdapter.delete).toHaveBeenCalledWith(
				'/path',
				expect.objectContaining({
					headers: expect.objectContaining({ authorization: 'Bearer test-token-xyz' })
				})
			);
		});
	});

	describe('getMageId', () => {
		it('should return the mage_id from authentication', async () => {
			const mageId = await adapter.getMageId();

			expect(mageId).toBe('MAG123');
		});
	});
});
