const test = require('ava');
const prettier = require('prettier');

/**
 *
 * @param {string} code
 * @param {prettier.Options} options
 */
const prettify = (code, options) =>
	prettier.format(code, { filepath: 'file.ts', parser: 'typescript', plugins: ['.'], ...options });

test('sorts imports', t => {
	const code = `
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`;

	const formattedCode = prettify(code);

	t.is(formattedCode.split('\n')[0], 'import { bar, foo } from "foobar";');
});

test('removes unused imports', t => {
	const code = 'import { foo } from "foobar"';

	const formattedCode = prettify(code);

	t.is(formattedCode, '');
});

test('works without a filepath', t => {
	const code = `
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`;

	const formattedCode = prettify(code, { filepath: undefined });

	t.is(formattedCode.split('\n')[0], 'import { bar, foo } from "foobar";');
});
