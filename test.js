const test = require('ava');
const prettier = require('prettier');

/**
 *
 * @param {string} code
 * @param {prettier.Options} options
 */
const prettify = (code, options) => prettier.format(code, { plugins: ['.'], filepath: 'file.ts', ...options });

const prettierOptions = [{ parser: 'babel' }, { parser: 'typescript' }];

prettierOptions.forEach((options) => {
	const prefixTitle = (title) => `[${options.parser}] ${title}`;

	test(prefixTitle('sorts imports'), (t) => {
		const code = `
			import { foo, bar } from "foobar"
	
			export const foobar = foo + bar
		`;

		const formattedCode = prettify(code, options);

		t.is(formattedCode.split('\n')[0], 'import { bar, foo } from "foobar";');
	});

	test(prefixTitle('removes partial unused imports'), (t) => {
		const code = `
			import { foo, bar, baz } from "foobar";
	
			const foobar = foo + baz
		`;

		const formattedCode = prettify(code, options);

		t.is(formattedCode.split('\n')[0], 'import { baz, foo } from "foobar";');
	});

	test(prefixTitle('removes completely unused imports'), (t) => {
		const code = 'import { foo } from "foobar"';

		const formattedCode = prettify(code, options);

		t.is(formattedCode, '');
	});

	test(prefixTitle('works with multi-line imports'), (t) => {
		const code = `
			import {
				foo,
				bar,
				baz,
			} from "foobar";
	
			console.log({ foo, bar, baz });
		`;

		const formattedCode = prettify(code, options);

		t.is(formattedCode.split('\n')[0], 'import { bar, baz, foo } from "foobar";');
	});

	test(prefixTitle('works without a filepath'), (t) => {
		const code = `
			import { foo, bar } from "foobar"
	
			export const foobar = foo + bar
		`;

		const formattedCode = prettify(code, { ...options, filepath: undefined });

		t.is(formattedCode.split('\n')[0], 'import { bar, foo } from "foobar";');
	});

	test(prefixTitle('files with `// organize-imports-ignore` are skipped'), (t) => {
		const code = `
			// organize-imports-ignore
			import { foo, bar } from "foobar"
	
			export const foobar = foo + bar
		`;

		const formattedCode = prettify(code, options);

		t.is(formattedCode.split('\n')[1], 'import { foo, bar } from "foobar";');
	});
});
