const { getMacro, prettify } = require('./_utils');
const test = require('ava').default;

const macros = ['typescript', 'babel', 'babel-ts'].map((parser) => getMacro(parser));

for (const macro of macros) {
	test(
		'sorts imports',
		macro,
		`
			import { foo, bar } from "foobar"

			export const foobar = foo + bar
		`,
		'import { bar, foo } from "foobar";',
	);

	test(
		'removes partially unused imports',
		macro,
		`
			import { foo, bar, baz } from "foobar";

			const foobar = foo + baz
		`,
		'import { baz, foo } from "foobar";',
	);

	test('removes completely unused imports', macro, 'import { foo } from "foobar"', '');

	test(
		'works with multi-line imports',
		macro,
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
		macro,
		`
			import { foo, bar } from "foobar"

			export const foobar = foo + bar
		`,
		'import { bar, foo } from "foobar";',
		{ options: { filepath: undefined } },
	);

	test(
		'files with `// organize-imports-ignore` are skipped',
		macro,
		`
			// organize-imports-ignore
			import { foo, bar } from "foobar"

			export const foobar = foo + bar
		`,
		'import { foo, bar } from "foobar";',
		{ transformer: (res) => res.split('\n')[1] },
	);
}

test('skips when formatting a range', async (t) => {
	const code = 'import { foo } from "./bar";';

	const formattedCode1 = await prettify(code, { rangeEnd: 10 });
	const formattedCode2 = await prettify(code, { rangeStart: 10 });

	t.is(formattedCode1, code);
	t.is(formattedCode2, code);
});

test('does not remove unused imports with `organizeImportsSkipDestructiveCodeActions` enabled', async (t) => {
	const code = `import { foo } from "./bar";
`;

	const formattedCode = await prettify(code, { organizeImportsSkipDestructiveCodeActions: true });

	t.is(formattedCode, code);
});

test('does not remove unused imports with `organizeImportsMode` set to `SortAndCombine`', async (t) => {
	const code = `import { foo } from "./bar";
`;

	const formattedCode = await prettify(code, { organizeImportsMode: 'SortAndCombine' });

	t.is(formattedCode, code);
});

test('sort and combine with `organizeImportsMode` set to `SortAndCombine`', async (t) => {
	const code = `
			import { foo } from "foobar";
      import { bar, baz } from "foobar";

			const foobar = foo + baz
		`;

	const expect = 'import { bar, baz, foo } from "foobar";';

	const formattedCode = await prettify(code, { organizeImportsMode: 'SortAndCombine' });

	t.is(formattedCode.split('\n')[0], expect);
});

test('only remove unused imports with `organizeImportsMode` set to `RemoveUnused`', async (t) => {
	const code = `
			import { foo, bar, baz } from "foobar";

			const foobar = foo + baz
		`;
	const expect = 'import { foo, baz } from "foobar";';

	const formattedCode = await prettify(code, { organizeImportsMode: 'RemoveUnused' });

	t.is(formattedCode.split('\n')[0], expect);
});
