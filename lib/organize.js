const { applyTextChanges } = require('./apply-text-changes');
const { ServiceHost, VueServiceHost } = require('./service-host');

/**
 * Organize the given code.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
module.exports.organize = (code, { filepath = 'file.ts', parentParser, parser }) => {
	/**
	 * @todo remove this once Prettier has fixed the child-parser preprocessing bug
	 * @see https://github.com/prettier/prettier/issues/11206
	 */
	if (parentParser === 'vue') {
		return code; // we already did the preprocessing for the `vue` parent parser
	}

	/**
	 * @type {ts.LanguageService}
	 */
	let languageService;

	if (parser === 'vue') {
		languageService = require('@volar/vue-typescript').createLanguageService(new VueServiceHost(filepath, code));
	} else {
		languageService = require('typescript').createLanguageService(new ServiceHost(filepath, code));
	}

	const fileChanges = languageService.organizeImports({ type: 'file', fileName: filepath }, {}, {})[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};
