import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FetchAdapter } from '../FetchAdapter';
import { HttpError } from '../HttpError';

describe('FetchAdapter', () => {
	const baseURL = 'https://api.example.com/v1';
	let adapter: FetchAdapter;
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		adapter = new FetchAdapter(baseURL);
		mockFetch = vi.fn();
		vi.stubGlobal('fetch', mockFetch);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	function mockResponse(data: unknown, ok = true, status = 200, statusText = 'OK') {
		mockFetch.mockResolvedValueOnce({
			ok,
			status,
			statusText,
			json: () => Promise.resolve(data),
			text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data))
		});
	}

	describe('URL building', () => {
		it('should prepend baseURL to the path', async () => {
			mockResponse({ result: 'ok' });

			await adapter.get('/test');

			expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/v1/test', expect.any(Object));
		});

		it('should append query params', async () => {
			mockResponse({ result: 'ok' });

			await adapter.get('/test', { params: { foo: 'bar', num: 42 } });

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain('foo=bar');
			expect(url).toContain('num=42');
		});

		it('should skip undefined params', async () => {
			mockResponse({ result: 'ok' });

			await adapter.get('/test', { params: { foo: 'bar', skip: undefined } });

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain('foo=bar');
			expect(url).not.toContain('skip');
		});

		it('should convert boolean params to strings', async () => {
			mockResponse({ result: 'ok' });

			await adapter.get('/test', { params: { active: true } });

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain('active=true');
		});

		it('should not append ? if all params are undefined', async () => {
			mockResponse({ result: 'ok' });

			await adapter.get('/test', { params: { a: undefined } });

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toBe('https://api.example.com/v1/test');
		});
	});

	describe('headers', () => {
		it('should include content-type: application/json by default', async () => {
			mockResponse({});

			await adapter.get('/test');

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect((options.headers as Record<string, string>)['content-type']).toBe('application/json');
		});

		it('should merge defaultHeaders over content-type', async () => {
			adapter.setHeader('content-type', 'text/plain');
			mockResponse({});

			await adapter.get('/test');

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect((options.headers as Record<string, string>)['content-type']).toBe('text/plain');
		});

		it('should merge config.headers over defaultHeaders', async () => {
			adapter.setHeader('x-custom', 'default');
			mockResponse({});

			await adapter.get('/test', { headers: { 'x-custom': 'override' } });

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect((options.headers as Record<string, string>)['x-custom']).toBe('override');
		});
	});

	describe('auth', () => {
		it('should set Basic auth header via Buffer', async () => {
			mockResponse({});

			await adapter.get('/test', {
				auth: { username: 'user', password: 'pass' }
			});

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			const expected = Buffer.from('user:pass').toString('base64');
			expect((options.headers as Record<string, string>)['authorization']).toBe(`Basic ${expected}`);
		});
	});

	describe('body serialization', () => {
		it('should JSON.stringify the body for POST', async () => {
			mockResponse({});

			await adapter.post('/test', { key: 'value' });

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect(options.body).toBe(JSON.stringify({ key: 'value' }));
		});

		it('should not include body for GET', async () => {
			mockResponse({});

			await adapter.get('/test');

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect(options.body).toBeUndefined();
		});

		it('should not include body for DELETE', async () => {
			mockResponse({});

			await adapter.delete('/test');

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect(options.body).toBeUndefined();
		});
	});

	describe('HTTP methods', () => {
		it('should use GET method', async () => {
			mockResponse({});
			await adapter.get('/test');
			expect(mockFetch.mock.calls[0][1].method).toBe('GET');
		});

		it('should use POST method', async () => {
			mockResponse({});
			await adapter.post('/test', {});
			expect(mockFetch.mock.calls[0][1].method).toBe('POST');
		});

		it('should use PUT method', async () => {
			mockResponse({});
			await adapter.put('/test', {});
			expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
		});

		it('should use DELETE method', async () => {
			mockResponse({});
			await adapter.delete('/test');
			expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
		});
	});

	describe('response handling', () => {
		it('should return parsed JSON on success', async () => {
			mockResponse({ data: 'test' });

			const result = await adapter.get('/test');

			expect(result).toEqual({ data: 'test' });
		});

		it('should throw HttpError with JSON data on error response', async () => {
			mockResponse({ error: 'not found' }, false, 404, 'Not Found');

			await expect(adapter.get('/test')).rejects.toThrow(HttpError);
		});

		it('should throw HttpError with correct properties', async () => {
			mockResponse({ error: 'forbidden' }, false, 403, 'Forbidden');

			try {
				await adapter.get('/test');
				expect.fail('should have thrown');
			} catch (err) {
				const httpError = err as HttpError;
				expect(httpError).toBeInstanceOf(HttpError);
				expect(httpError.status).toBe(403);
				expect(httpError.statusText).toBe('Forbidden');
				expect(httpError.data).toEqual({ error: 'forbidden' });
			}
		});

		it('should fallback to text when error response JSON parsing fails', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				json: () => Promise.reject(new Error('invalid json')),
				text: () => Promise.resolve('plain text error')
			});

			try {
				await adapter.get('/test');
				expect.fail('should have thrown');
			} catch (err) {
				const httpError = err as HttpError;
				expect(httpError).toBeInstanceOf(HttpError);
				expect(httpError.data).toBe('plain text error');
			}
		});
	});

	describe('setHeader', () => {
		it('should add default headers to requests', async () => {
			adapter.setHeader('x-api-key', 'my-key');
			mockResponse({});

			await adapter.get('/test');

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect((options.headers as Record<string, string>)['x-api-key']).toBe('my-key');
		});
	});
});
