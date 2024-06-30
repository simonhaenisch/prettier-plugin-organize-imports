const { findTsconfig } = require('./find-tsconfig');
const { getVueCompilerOptions } = require('./get-compiler-options');
const { getTypeScriptLanguageServiceHost } = require('./service-host');
const { createProxyLanguageService, decorateLanguageServiceHost } = require('@volar/typescript');
const { createLanguage, createVueLanguagePlugin, FileMap } = require('@vue/language-core');

/**
 * Get the correct language service for the given parser.
 *
 * @param {import('prettier').ParserOptions['parser']} parser
 * @param {string} filepath
 * @param {string} code
 *
 * @returns {import('typescript').LanguageService}
 */
const getLanguageService = (parser, filepath, code) => {
	const ts = require('typescript');
	const langaugeServicehost = getTypeScriptLanguageServiceHost(filepath, code);
	let languageService = ts.createLanguageService(langaugeServicehost);

	if (parser === 'vue') {
		const { initialize, proxy } = createProxyLanguageService(languageService);
		const tsconfig = findTsconfig(filepath);
		const vueLanguagePlugin = createVueLanguagePlugin(ts, s => s, () => '', () => false, langaugeServicehost.getCompilationSettings(), getVueCompilerOptions(tsconfig))
		const language = createLanguage([vueLanguagePlugin], new FileMap(ts.sys.useCaseSensitiveFileNames), () => { });
		const snapshot = langaugeServicehost.getScriptSnapshot(filepath);
		if (!snapshot) {
			throw Error(`No snapshot for ${filepath}`);
		}
		language.scripts.set(filepath, snapshot);
		initialize(language);
		decorateLanguageServiceHost(ts, language, langaugeServicehost)
		languageService = proxy;
	}

	return languageService;
};

module.exports = { getLanguageService };
