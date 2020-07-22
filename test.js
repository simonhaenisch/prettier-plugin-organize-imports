const test = require('ava');
const prettier = require('prettier');

/**
 *
 * @param {string} code
 * @param {prettier.Options} options
 */
const prettify = (code, options) =>
	prettier.format(code, { filepath: 'file.ts', parser: 'typescript', plugins: ['.'], ...options });

test('sorts imports', (t) => {
	const code = `
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`;

	const formattedCode = prettify(code);

	t.is(formattedCode.split('\n')[0], 'import { bar, foo } from "foobar";');
});

test('removes partial unused imports', (t) => {
	const code = `
		import { foo, bar, baz } from "foobar";

		const foobar = foo + baz
	`;

	const formattedCode = prettify(code);

	t.is(formattedCode.split('\n')[0], 'import { baz, foo } from "foobar";');
});

test('removes completely unused imports', (t) => {
	const code = 'import { foo } from "foobar"';

	const formattedCode = prettify(code);

	t.is(formattedCode, '');
});

test('works with multi-line imports', (t) => {
	const code = `
		import {
			foo,
			bar,
			baz,
		} from "foobar";

		console.log({ foo, bar, baz });
	`;

	const formattedCode = prettify(code);

	t.is(formattedCode.split('\n')[0], 'import { bar, baz, foo } from "foobar";');
});

test('works without a filepath', (t) => {
	const code = `
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`;

	const formattedCode = prettify(code, { filepath: undefined });

	t.is(formattedCode.split('\n')[0], 'import { bar, foo } from "foobar";');
});

test('files with `// organize-imports-ignore` are skipped', (t) => {
	const code = `
		// organize-imports-ignore
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`;

	const formattedCode = prettify(code);

	t.is(formattedCode.split('\n')[1], 'import { foo, bar } from "foobar";');
});

test('maintain existing comments', (t) => {
	const code = `    
	// comment on top of line 1
	import { foo, bar } from "foobar";
	// comment on top of line 2
	import baz from "baz";`;

	const formattedCode = prettify(code);

	t.is(code.split('\n').map(l => l.trim()).join('\n'), formattedCode)
})
