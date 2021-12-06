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

test('works with Svelte component and module scripts', (t) => {
	const code = `<script context="module">
  import   {writable,derived} from "svelte/store";
  const firstName = writable("John");
	const lastName = derived(firstName, ($firstName) => $firstName + " Doe");
</script>

<script>
  import  {tick,onMount} from "svelte";
  onMount(() => {
    tick().then(() => {
      console.log("Svelte component mounted");
    });
  });
</script>

<main>
  <p>
    {$firstName} {$lastName}
  </p>
</main>
{#if $firstName}
  <p>{$firstName}</p>
{/if}

<style>
  main {
		display: flex;
  }
</style>
`;

	const formattedCode = prettify(code, { filepath: 'file.svelte' });

	t.is(formattedCode.split('\n')[1], `  import { derived, writable } from "svelte/store";`);
	t.is(formattedCode.split('\n')[7], `  import { onMount, tick } from "svelte";`);
});

test('works with Svelte Typescript component and module scripts', (t) => {
	const code = `<script lang="ts" context="module">
  import   {writable,derived} from "svelte/store";
  const firstName = writable("John");
	const lastName = derived(firstName, ($firstName) => $firstName + " Doe");
</script>

<script lang="ts">
  import  {tick,onMount} from "svelte";
  onMount(() => {
    tick().then(() => {
      console.log("Svelte component mounted");
    });
  });
</script>

<main>
  <p>
    {$firstName} {$lastName}
  </p>
</main>

<style>
  main {
		display: flex;
  }
</style>
`;

	const formattedCode = prettify(code, { filepath: 'file.svelte' });

	t.is(formattedCode.split('\n')[1], `  import { derived, writable } from "svelte/store";`);
	t.is(formattedCode.split('\n')[7], `  import { onMount, tick } from "svelte";`);
});
