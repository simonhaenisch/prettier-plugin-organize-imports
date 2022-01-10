const test = require('ava');
const prettier = require('prettier');

/**
 * @param {string} code
 * @param {prettier.Options} options
 */
const prettify = (code, options) => prettier.format(code, { plugins: ['.'], filepath: 'file.ts', ...options });

/**
 * @param {prettier.Options['parser']} parser
 */
const getMacro = (parser) => {
	/**
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

	/**
	 * @param {string} title
	 */
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

test('works with TypeScript code inside Vue files', (t) => {
	const code = `
		<script lang="ts">
			import  {defineComponent,compile} from 'vue';
			console.log(compile);
			export default defineComponent({});
		</script>
	`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode.split('\n')[1], `import { compile, defineComponent } from "vue";`);
});

test('preserves new lines and comments in Vue files', (t) => {
	const code = `<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    // please don't break me
    const test = ref("");

    return { test };
  },
});
</script>

<style></style>
`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode, code);
});

test('supports Vue SFCs with <script setup>', (t) => {
	const code = `
<script setup>
import { a, c, b } from "x";
const d = a + b + c;
</script>
	`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode.split('\n')[1], `import { a, b, c } from "x";`);
});

test('supports Vue SFCs with <script setup lang="ts">', (t) => {
	const code = `
<script setup lang="ts">
import { a, c, b } from "x";
const d : number = a + b + c;
</script>
	`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode.split('\n')[1], `import { a, b, c } from "x";`);
});

/**
 * It might be rare but it is allowed to use both kinds of script tag in one file:
 * https://v3.vuejs.org/api/sfc-script-setup.html#usage-alongside-normal-script
 */
test('supports Vue SFCs with both <script> tags', (t) => {
	const code = `<script>
import { unused } from "y";
import { f } from "f";
f();
</script>
<script setup>
import { unused } from "y";
import { a, c, b } from "x";
const d = a + b + c;
</script>
`;

	const expected = `<script>
import { f } from "f";
f();
</script>
<script setup>
import { a, b, c } from "x";
const d = a + b + c;
</script>
`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode, expected);
});
