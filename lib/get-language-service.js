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
	if (parser === 'svelte') {
		return require('@volar-examples/svelte-typescript').createLanguageService(
			getVueLanguageServiceHost(filepath, code),
		);
	}

	if (parser === 'vue') {
		return require('@volar/vue-typescript').createLanguageService(getVueLanguageServiceHost(filepath, code));
	}

	return require('typescript').createLanguageService(getTypeScriptLanguageServiceHost(filepath, code));
};

module.exports = { getLanguageService };
