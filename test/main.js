const { getMacro, prettify } = require('./_utils');
const test = require('ava').default;

/**
 * @type {import('ava').OneOrMoreMacros<[string, string] | [string, string, { options?: import('prettier').Options, transformer?: (res: string) => string }], unknown>}
 */
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

test('does not remove unused imports with `organizeImportsSkipDestructiveCodeActions` enabled', async (t) => {
	const code = `import { foo } from "./bar";
`;

	const formattedCode = await prettify(code, { organizeImportsSkipDestructiveCodeActions: true });

	t.is(formattedCode, code);
});
