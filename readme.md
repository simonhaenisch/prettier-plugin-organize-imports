![Tests](https://github.com/simonhaenisch/prettier-plugin-organize-imports/workflows/Tests/badge.svg)

# Prettier Plugin: Organize Imports

> Make sure that your import statements stay consistent no matter who writes them and what their preferences are.

A plugin that makes Prettier organize your imports (i. e. sorts, combines and removes unused ones) using the `organizeImports` feature of the TypeScript language service API. This is the same as using the "Organize Imports" action in VS Code.

**Features**

- 👌 Dependency-free (just peer-dependencies you probably already have).
- 💪 Supports `.js`, `.jsx`, `.ts`, `.tsx` and `.vue` files.
- 🚀 Zero config.
- 🤓 No more weird diffs or annoying merge conflicts in PRs caused by import statements.
- 🤯 If your editor supports auto-imports, you'll stop thinking about your imports so much that you won't even care about their order anymore.

**Caveat**

This plugin inherits, extends and overrides the built-in Prettier parsers for `babel`, `babel-ts`, `typescript` and `vue`, i. e., it's incompatible with other plugins that do the same... so only the last loaded plugin that exports one of those parsers will function.

## Installation

```sh
npm install --save-dev prettier-plugin-organize-imports
```

_`prettier` and `typescript` are peer dependencies, so make sure you have those installed in your project._

## Usage

The plugin will be loaded by Prettier automatically. No configuration needed.

_Note: Some package managers (e. g. [Yarn 2](https://github.com/prettier/prettier/issues/8474)) don't support automatic plugin discovery. Check the [Prettier documentation](https://prettier.io/docs/en/plugins.html) for alternatives to manually load plugins in that case._

Files containing the substring `// organize-imports-ignore` or `// tslint:disable:ordered-imports` are skipped.

### Vue.js

Make sure that you have the optional peer dependency `@volar/vue-typescript` installed.

```
npm i --save-dev @volar/vue-typescript
```

### Debug Logs

If something doesn't work, you can try to prefix your command with `DEBUG=true` which will enable this plugin to print some logs.

## Rationale/Disclaimer

This plugin acts outside of [Prettier's scope](https://prettier.io/docs/en/rationale#what-prettier-is-_not_-concerned-about) because _"Prettier only prints code. It does not transform it."_, and technically sorting is a code transformation because it changes the AST (this plugin even removes code, i. e. unused imports). In my opinion however, the import statements are not _really_ part of the code, they are merely directives that instruct the module system where to find the code (only true as long as your imports are side-effects free regarding the global scope, i. e. import order doesn't matter), comparable with `using` directives in C# or `#include` preprocessing directives in C. Therefore the practical benefits outweigh sticking with the philosophy in this case.

## Changelog

Version `3.0.0` switches to a different package for Vue support, which fixes some more issues, e. g. support for setup scripts. No breaking changes otherwise.

Version `2.3.4` fixes an issue with Vue v2 files.

Version `2.3.3` fixes a bug where default imports were removed erroneously.

Version `2.3.1` adds debug logs and fixes Vue.js support.

Version `2.2.0` adds a compiler options cache to improve performance.

Version `2.1.0` adds support for Vue.js (`.vue` files).

Version `2.0.0` adds support for the parsers `babel` (i. e. JavaScript) and `babel-ts` which are only available since Prettier v2 (and thus the peer dependency has received a major bump).

## License

[MIT](/license).
