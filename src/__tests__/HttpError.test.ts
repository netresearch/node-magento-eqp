import { describe, it, expect } from 'vitest';
import { HttpError } from '../HttpError';

describe('HttpError', () => {
	it('should set status, statusText, and data', () => {
		const error = new HttpError(404, 'Not Found', { message: 'Resource not found' });

		expect(error.status).toBe(404);
		expect(error.statusText).toBe('Not Found');
		expect(error.data).toEqual({ message: 'Resource not found' });
	});

	it('should set the message to "HTTP {status}: {statusText}"', () => {
		const error = new HttpError(500, 'Internal Server Error', null);

		expect(error.message).toBe('HTTP 500: Internal Server Error');
	});

	it('should set the name to "HttpError"', () => {
		const error = new HttpError(400, 'Bad Request', null);

		expect(error.name).toBe('HttpError');
	});

	it('should be an instance of Error', () => {
		const error = new HttpError(401, 'Unauthorized', null);

		expect(error).toBeInstanceOf(Error);
	});

	it('should accept various data types', () => {
		expect(new HttpError(400, 'Bad Request', 'string data').data).toBe('string data');
		expect(new HttpError(400, 'Bad Request', 42).data).toBe(42);
		expect(new HttpError(400, 'Bad Request', null).data).toBeNull();
		expect(new HttpError(400, 'Bad Request', undefined).data).toBeUndefined();
		expect(new HttpError(400, 'Bad Request', [1, 2]).data).toEqual([1, 2]);
	});
});
