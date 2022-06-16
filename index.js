const { parsers: babelParsers } = require('prettier/parser-babel');
const { parsers: htmlParsers } = require('prettier/parser-html');
const { parsers: typescriptParsers } = require('prettier/parser-typescript');
const ts = require('typescript');

const { organize } = require('./lib/organize');
const { applyTextChanges } = require('./lib/apply-text-changes');

/**
 * Organize the code's imports using the `organizeImports` feature of the TypeScript language service API.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
const organizeImports = (code, options) => {
	if (code.includes('// organize-imports-ignore') || code.includes('// tslint:disable:ordered-imports')) {
		return code;
	}

	try {
		return organize(code, options);
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}

		return code;
	}
};

/**
 * Set `organizeImports` as the given parser's `preprocess` hook, or merge it with the existing one.
 *
 * @param {import('prettier').Parser} parser prettier parser
 */
const withOrganizeImportsPreprocess = (parser) => {
	return {
		...parser,
		/**
		 * @param {string} code
		 * @param {import('prettier').ParserOptions} options
		 */
		preprocess: (code, options) =>
			organizeImports(parser.preprocess ? parser.preprocess(code, options) : code, options),
	};
};

exports.parsers = {
	babel: withOrganizeImportsPreprocess(babelParsers.babel),
	'babel-ts': withOrganizeImportsPreprocess(babelParsers['babel-ts']),
	typescript: withOrganizeImportsPreprocess(typescriptParsers.typescript),
	vue: withOrganizeImportsPreprocess(htmlParsers.vue),
};
