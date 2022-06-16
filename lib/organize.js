const ts = require('typescript');

const { applyTextChanges } = require('./apply-text-changes');
const { ServiceHost } = require('./service-host');

/**
 * Organize the given code.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
module.exports.organize = (code, options) => {
	const { filepath = 'file.ts' } = options;

	const fileName = options.parser === 'vue' ? filepath + '.ts' : filepath;

	/**
	 * @type {ts.LanguageService}
	 */
	let languageService;

	/**
	 * @todo remove this once Prettier has fixed the child-parser preprocessing bug
	 * @see https://github.com/prettier/prettier/issues/11206
	 */
	if (options.parentParser === 'vue') {
		return code; // we already did the preprocessing for the `vue` parent parser
	} else if (options.parser === 'vue') {
		const tsServerLib = require('typescript/lib/tsserverlibrary');
		const vueTs = require('@volar/vue-typescript');

		const lsContext = vueTs.createLanguageServiceContext(tsServerLib, new ServiceHost(fileName, code));

		languageService = lsContext.typescriptLanguageService;
	} else {
		languageService = ts.createLanguageService(new ServiceHost(fileName, code));
	}

	const fileChanges = languageService.organizeImports({ type: 'file', fileName }, {}, {})[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};
