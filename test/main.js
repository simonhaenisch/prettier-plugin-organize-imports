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
	test(
		'leaves commented imports intact',
		macro,
		`
			// import { foo, bar } from "foobar"

			export const foobar = foo + bar
		`,
		'// import { foo, bar } from "foobar"',
	);
	test(
		'leaves comments in borders of multiline imports intact',
		macro,
		`
import {
	// DataGrid,
	GridCellParams,
	GridColDef,
	GridLinkOperator,
	GridRenderCellParams,
	// plPL,
} from "@mui/x-data-grid";

DataGrid; GridCellParams; GridColDef; GridLinkOperator; GridRenderCellParams; plPL;
		`,
		`import {
  // DataGrid,
  GridCellParams,
  GridColDef,
  GridLinkOperator,
  GridRenderCellParams,
  // plPL,
} from "@mui/x-data-grid";`
		,
		{ transformer: (res) => res.split('\n').slice(0, 8).join('\n') },
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
