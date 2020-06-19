![Tests](https://github.com/simonhaenisch/prettier-plugin-organize-imports/workflows/Tests/badge.svg)

# Prettier Plugin: Organize Imports

A plugin that makes Prettier organize your imports (i. e. sort and remove unused imports) using the `organizeImports` feature of the TypeScript language service API. This is the same as using the "Organize Imports" action in VS Code.

## Installation

```sh
npm install --save-dev prettier-plugin-organize-imports
```

_`prettier` and `typescript` are peer dependencies, so make sure you have those installed in your project._

## Usage

The plugin will be loaded by Prettier automatically. No configuration needed.

Files containing the substring `// organize-imports-ignore` or `// tslint:disable:ordered-imports` are skipped.

## License

[MIT](/license).
