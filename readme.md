![Tests](https://github.com/simonhaenisch/prettier-plugin-organize-imports/workflows/Tests/badge.svg)

# Prettier Plugin: Organize Imports

> Make sure that your import statements stay consistent no matter who writes them and what their preferences are.

A plugin that makes Prettier organize your imports (i. e. sorts, combines and removes unused ones) using the `organizeImports` feature of the TypeScript language service API. This is the same as using the "Organize Imports" action in VS Code.

**Features**

- 👌 Dependency-free (just peer-dependencies you probably already have).
- 💪 Supports `.js`, `.jsx`, `.ts`, `.tsx` and `.vue` files.
- 🤓 No more weird diffs or annoying merge conflicts in PRs caused by import statements.
- 🤯 If your editor supports auto-imports, you'll stop thinking about your imports so much that you won't even care about their order anymore.

**Caveat**

This plugin inherits, extends, and overrides the built-in Prettier parsers for `babel`, `babel-ts`, `typescript` and `vue`. This means that it is incompatible with other plugins that do the same; only the last loaded plugin that exports one of those parsers will function.

## Installation

### Install the Dependency From npm

```sh
# If you use npm:
npm install --save-dev prettier-plugin-organize-imports

# If you use yarn:
yarn add --dev prettier-plugin-organize-imports

# If you use pnpm:
pnpm add --save-dev prettier-plugin-organize-imports
```

Running one of these commands will add `prettier-plugin-organize-imports` to the `devDependencies` section of your project's `package.json` file and download the corresponding files.

Note that `prettier` and `typescript` are peer dependencies, so make sure you also have those installed in your project.

### Add the Plugin to Your Prettier Configuration

If you do not already have [a Prettier configuration file](https://prettier.io/docs/en/configuration.html), create a file called `prettier.config.mjs` at the root of your project. (While Prettier will work with many different configuration file names, this is the file name that you should choose for modern projects.)

Inside the Prettier configuration, you need to include `prettier-plugin-organize-imports` inside of the `plugins` array. In other words, your configuration file should look something like this:

```js
// This is the configuration file for Prettier, the auto-formatter:
// https://prettier.io/docs/en/configuration.html

/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-organize-imports"],
};

export default config;
```

Note that previous versions of this plugin would just work without having you to add anything to the Prettier configuration, but Prettier 3.0 removed the feature called "[plugin search](https://github.com/prettier/prettier/pull/14759)" that enabled this functionality.

## Usage

Once the plugin is loaded (by specifying it in your Prettier configuration file), it will automatically organize your imports every time that Prettier is run.

However, files containing the substring `// organize-imports-ignore` or `// tslint:disable:ordered-imports` are skipped.

### ESLint

[ESLint](https://eslint.org/) is the most popular JavaScript/TypeScript linter.

If you are setting up Prettier with ESLint for the first time, see the ["Integrating with Linters"](https://prettier.io/docs/en/integrating-with-linters.html) section in the Prettier docs.

This plugin will work out of the box with ESLint, meaning that if you already have Prettier working alongside ESLint, then adding this plugin to your Prettier config won't break anything.

With that said, note that there are some ESLint rules that require you to organize your import statements in a certain way. If your ESLint configuration already contains these rules, then make sure that you disable them if you decide to adopt this plugin. (Your CI pipeline should validate that all files are formatted correctly with something like `npx prettier --loglevel warn --check .` in addition to validating that all files pass ESLint.)

### React

Depending on your configuration, if you need the `React` import to stay even if it's "unused" (i.e. only needed for the JSX factory), make sure to have the `jsx` option set to `react` in your `tsconfig.json`. For more details, [see the TypeScript handbook](https://www.typescriptlang.org/docs/handbook/jsx.html#basic-usage).

### Vue.js

Make sure that you have the optional peer dependency `@volar/vue-typescript` installed.

```
npm i --save-dev @volar/vue-typescript
```

If you're using Vue.js with Pug templates, you'll also need to install `@volar/vue-language-plugin-pug` as a dev dependency, and configure it in `vueCompilerOptions` (see [usage](https://www.npmjs.com/package/@volar/vue-language-plugin-pug)).

## Debug Logs

If something doesn't work, you can try to prefix your command with `DEBUG=true` which will enable this plugin to print some logs.

## Configuration

If you don't want destructive code actions (like removing unused imports), you can enable the option `organizeImportsSkipDestructiveCodeActions` via your Prettier config.

```js
// This is the configuration file for Prettier, the auto-formatter:
// https://prettier.io/docs/en/configuration.html

/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-organize-imports"],
  organizeImportsSkipDestructiveCodeActions: true,
};
```

## Rationale/Disclaimer

This plugin acts outside of [Prettier's scope](https://prettier.io/docs/en/rationale#what-prettier-is-_not_-concerned-about) because _"Prettier only prints code. It does not transform it."_, and technically sorting is a code transformation because it changes the AST (this plugin even removes code, i. e. unused imports). In my opinion however, the import statements are not _really_ part of the code, they are merely directives that instruct the module system where to find the code (only true as long as your imports are side-effects free regarding the global scope, i. e. import order doesn't matter), comparable with `using` directives in C# or `#include` preprocessing directives in C. Therefore the practical benefits outweigh sticking with the philosophy in this case.

## Changelog

Version `3.2.2` fixes a performance regression introduced in `3.2.0`.

Version `3.2.1` fixes the implementation of the language service host's `getCurrentDirectory` method to return the directory containing the tsconfig, rather than using `ts.sys.getCurrentDirectory` (which returns `process.cwd()`). This should prevent issues with resolving compiler plugins with Volar (which is used for Vue support).

Version `3.2.0` adds and fixes support for pug templates in Vue files (via `@volar/vue-language-plugin-pug`). Please be aware that you'll need to update your version of the `@volar/vue-typescript` peer dependency from `0.x` to `1.x`.

Version `3.1.0` adds an option to skip destructive code actions like removing unused imports.

Version `3.0.3` fixes a performance regression introduced in `3.0.2`.

Version `3.0.2` fixes a regression introduced by adding some file-system related methods to the language service host (to fix a bug), which revealed that another method's implementation was incorrect.

Version `3.0.1` bumps the `@volar/vue-typescript` version to fix more edge cases, e. g. not removing imports when a component is used via kebab-case naming. `@volar/vue-typescript` is now defined as an optional peer dependency and you'll need to install version `0.39` or later. Furthermore a fix has been added that should help support more module resolution algorithms.

Version `3.0.0` switches to a different package for Vue support, which fixes some more issues, e. g. support for setup scripts. No breaking changes otherwise.

Version `2.3.4` fixes an issue with Vue v2 files.

Version `2.3.3` fixes a bug where default imports were removed erroneously.

Version `2.3.1` adds debug logs and fixes Vue.js support.

Version `2.2.0` adds a compiler options cache to improve performance.

Version `2.1.0` adds support for Vue.js (`.vue` files).

Version `2.0.0` adds support for the parsers `babel` (i. e. JavaScript) and `babel-ts` which are only available since Prettier v2 (and thus the peer dependency has received a major bump).

## License

[MIT](/license).
