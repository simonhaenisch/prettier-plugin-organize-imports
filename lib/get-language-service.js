const { getTypeScriptLanguageServiceHost, getVueLanguageServiceHost } = require('./service-host');

/**
 * Get the correct language service for the given parser.
 *
 * @param {import('prettier').ParserOptions['parser']} parser
 * @param {string} filepath
 * @param {string} code
 *
 * @returns {ts.LanguageService}
 */
const getLanguageService = (parser, filepath, code) => {
	if (parser === 'vue' || parser === 'svelte') {
		return require('@volar/vue-typescript').createLanguageService(
			getVueLanguageServiceHost(filepath, code),
			/** @todo upgrade to a version with correct types */
			// @ts-ignore
			parser === 'svelte' ? [require('@volar-examples/svelte-language-core').languageModule] : undefined,
		);
	}

	return require('typescript').createLanguageService(getTypeScriptLanguageServiceHost(filepath, code));
};

module.exports = { getLanguageService };
