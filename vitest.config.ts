import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		root: './src',
		coverage: {
			provider: 'v8',
			include: ['**/*.ts'],
			exclude: ['types/**', '**/index.ts', '**/__tests__/**'],
			thresholds: {
				statements: 95,
				branches: 95,
				functions: 95,
				lines: 95
			}
		}
	}
});
