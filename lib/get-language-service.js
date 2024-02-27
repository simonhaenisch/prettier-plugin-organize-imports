const { createLanguages, createLanguageContext } = require('@vue/language-core');
const { createLanguageServiceHost, decorateLanguageService } = require('@volar/typescript');
const ts = require('typescript/lib/tsserverlibrary');
const { getTypeScriptLanguageServiceHost, getVueLanguageServiceHost } = require('./service-host');
const { getCompilerOptions, getVueCompilerOptions } = require('./get-compiler-options');
const { findTsconfig } = require('./find-tsconfig');

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
	if (parser === 'vue') {
		const tsconfig = findTsconfig(filepath);
		const compilerOptions = getCompilerOptions(tsconfig);
		const host = getVueLanguageServiceHost(compilerOptions, filepath, code);
		const vueLanguages = ts ? createLanguages(ts, compilerOptions, getVueCompilerOptions(tsconfig)) : [];
		const core = createLanguageContext(host, vueLanguages);
		const tsLsHost = createLanguageServiceHost(core, ts, ts.sys);
		const tsLs = ts.createLanguageService(tsLsHost);

		decorateLanguageService(core.virtualFiles, tsLs, false);

		return tsLs;
	}

	return require('typescript').createLanguageService(getTypeScriptLanguageServiceHost(filepath, code));
};

module.exports = { getLanguageService };
