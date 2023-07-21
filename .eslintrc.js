// ESLint, thank you for linting your own file and breaking it
// eslint-disable-next-line no-undef
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	rules: {
		'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
	}
};
