const test = require('ava').default;
const ts = require('typescript');
const { prettify } = require('./_utils');

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

test('works with Vue setup scripts', (t) => {
	const code = `
		<script setup lang="ts">
			import  {defineComponent,compile} from 'vue';
			export default defineComponent({});
		</script>
	`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode.split('\n')[1], `import { defineComponent } from "vue";`);
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

test('does not remove imports when Vue components use kebab case', (t) => {
	const code = `<template>
  <div>
    <n-divider />
  </div>
</template>

<script setup lang="ts">
import { NDivider } from "naive-ui";
</script>
`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode, code);
});

test('works with pug templates in Vue files', (t) => {
	const code = `<script setup lang="ts">
import { Foo, Bar } from "@/components";
</script>

<template lang="pug">
Foo
</template>
`;

	const expected = `<script setup lang="ts">
import { Foo } from "@/components";
</script>

<template lang="pug">
Foo
</template>
`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode, expected);
});

test.serial('works with Volar language plugins when not running from the project root', (t) => {
	const originalGetCurrentDir = ts.sys.getCurrentDirectory;

	ts.sys.getCurrentDirectory = () => '/';

	const code = `<script setup lang="ts">
import { Foo, Bar } from "@/components";
</script>

<template lang="pug">
Foo
</template>
`;

	const expected = `<script setup lang="ts">
import { Foo } from "@/components";
</script>

<template lang="pug">
Foo
</template>
`;

	const formattedCode = prettify(code, { filepath: 'file.vue' });

	t.is(formattedCode, expected);

	ts.sys.getCurrentDirectory = originalGetCurrentDir;
});
