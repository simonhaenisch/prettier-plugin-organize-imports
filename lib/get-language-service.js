const { createVueLanguagePlugin } = require('@vue/language-core');
const { createTypeScriptLanguage } = require('@volar/typescript');
const ts = require('typescript/lib/tsserverlibrary');
const { getTypeScriptLanguageServiceHost, getVueTypeScriptProjectHost } = require('./service-host');
const { getCompilerOptions, getVueCompilerOptions } = require('./get-compiler-options');
const { findTsconfig } = require('./find-tsconfig');

/**
 * Get the correct language service for the given parser.
 *
 * @typedef {NonNullable<ReturnType<import('@volar/typescript').createTypeScriptLanguage>['typescript']>} TypeScriptLanguage
 *
 * @param {import('prettier').ParserOptions['parser']} parser
 * @param {string} filepath
 * @param {string} code
 *
 * @returns {import('typescript').LanguageService}
 */
const getLanguageService = (parser, filepath, code) => {
	if (parser === 'vue') {
		const tsconfig = findTsconfig(filepath);
		const compilerOptions = getCompilerOptions(tsconfig);
		const vueCompilationOptions = getVueCompilerOptions(tsconfig);
		const host = getVueTypeScriptProjectHost(compilerOptions, filepath, code);
		const vueLanguagePlugin = createVueLanguagePlugin(
			ts,
			(id) => id,
			ts.sys.useCaseSensitiveFileNames,
			() => '',
			() => host.getScriptFileNames(),
			host.getCompilationSettings(),
			vueCompilationOptions,
		);
		const language = createTypeScriptLanguage(ts, [vueLanguagePlugin], host);
		const { languageServiceHost } = /** @type {TypeScriptLanguage} */ (language.typescript);
		const tsLs = ts.createLanguageService(languageServiceHost);

		return tsLs;
	}

	return require('typescript').createLanguageService(getTypeScriptLanguageServiceHost(filepath, code));
};

module.exports = { getLanguageService };
