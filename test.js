const test = require('ava');
const prettier = require('prettier');

/**
 * @param {string} code
 * @param {prettier.Options} options
 */
const prettify = (code, options) => prettier.format(code, { plugins: ['.'], filepath: 'file.ts', ...options });

const prettierOptions = [{ parser: 'babel' }, { parser: 'babel-ts' }, { parser: 'typescript' }];

/**
 * @param {prettier.Options['parser']} parser
 */
const getMacro = (parser) => {
	/**
	 *
	 * @param {test.Assertions} t
	 * @param {string} input
	 * @param {string} expected
	 * @param {object} [options]
	 * @param {prettier.Options} [options.options]
	 * @param {(res: string) => string} [options.transformer]
	 */
	function macro(t, input, expected, { options = {}, transformer = (res) => res.split('\n')[0] } = {}) {
		const formattedCode = prettify(input, { parser, ...options });

		t.is(transformer(formattedCode), expected);
	}

	macro.title = (title) => `[${parser}] ${title}`;

	return macro;
};

const macros = [getMacro('typescript'), getMacro('babel'), getMacro('babel-ts')];

test(
	'sorts imports',
	macros,
	`
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`,
	'import { bar, foo } from "foobar";',
);

test(
	'removes partially unused imports',
	macros,
	`
		import { foo, bar, baz } from "foobar";

		const foobar = foo + baz
	`,
	'import { baz, foo } from "foobar";',
);

test('removes completely unused imports', macros, 'import { foo } from "foobar"', '');

test(
	'works with multi-line imports',
	macros,
	`
		import {
			foo,
			bar,
			baz,
		} from "foobar";

		console.log({ foo, bar, baz });
	`,
	'import { bar, baz, foo } from "foobar";',
);

test(
	'works without a filepath',
	macros,
	`
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`,
	'import { bar, foo } from "foobar";',
	{ options: { filepath: undefined } },
);

test(
	'files with `// organize-imports-ignore` are skipped',
	macros,
	`
		// organize-imports-ignore
		import { foo, bar } from "foobar"

		export const foobar = foo + bar
	`,
	'import { foo, bar } from "foobar";',
	{ transformer: (res) => res.split('\n')[1] },
);
