![Tests](https://github.com/simonhaenisch/prettier-plugin-organize-imports/workflows/Tests/badge.svg)

# Prettier Plugin: Organize Imports

> Make sure that your import statements stay consistent no matter who writes them and what their preferences are.

A plugin that makes Prettier organize your imports (i. e. sort and remove unused imports) using the `organizeImports` feature of the TypeScript language service API. This is the same as using the "Organize Imports" action in VS Code.

## Installation

```sh
npm install --save-dev prettier-plugin-organize-imports
```

_`prettier` and `typescript` are peer dependencies, so make sure you have those installed in your project._

## Usage

The plugin will be loaded by Prettier automatically. No configuration needed.

Files containing the substring `// organize-imports-ignore` or `// tslint:disable:ordered-imports` are skipped.

## Changelog

Version `2.1.0` adds support for Vue.js (`.vue` files).

Version `2.0.0` adds support for the parsers `babel` (i. e. JavaScript) and `babel-ts` which are only available since Prettier v2 (and thus the peer dependency has received a major bump).

## Rationale

This plugin acts outside of [Prettier's scope](https://prettier.io/docs/en/rationale#what-prettier-is-_not_-concerned-about) because _"Prettier only prints code. It does not transform it."_, and technically sorting is a code transformation because it changes the AST (this plugin even removes code, i. e. unused imports). In my opinion however, the import statements are not _really_ part of the code, they are merely directives that instruct the module system where to find the code (only true as long as your imports are side-effects free regarding the global scope, i. e. import order doesn't matter), comparable with `using` directives in C# or `#include` preprocessing directives in C. Therefore the practical benefits outweigh sticking with the philosophy in this case.

## License

[MIT](/license).
