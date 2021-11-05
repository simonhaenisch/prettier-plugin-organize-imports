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
		const filePath = options.filepath || 'file.ts';

		/**
		 * @todo remove this once Prettier has fixed the child-parser preprocessing bug
		 * @see https://github.com/prettier/prettier/issues/11206
		 */
		if (options.parentParser === 'vue') {
			return code; // we already did the preprocessing for the `vue` parent parser
		} else if (options.parser === 'vue') {
			const { getVueSFCScript } = require('./lib/get-vue-sfc-script');

			const { script, scriptSetup } = getVueSFCScript(code, filePath);

			if (!script & !scriptSetup) {
				return code;
			}

			// We can assume that both section dont overlap.
			// And we order them, to change the file from the end backwards
			// so we don't have to reparse it.
			const changes = [script, scriptSetup]
				.filter(Boolean)
				.sort((a, b) => a.start > b.start)
				.map(({ content, start, end }) => ({
					newText: organize(content, filePath + '.ts'),
					span: {
						start,
						length: end - start,
					},
				}));

			return applyTextChanges(code, changes);
		}

		return organize(code, filePath);
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
