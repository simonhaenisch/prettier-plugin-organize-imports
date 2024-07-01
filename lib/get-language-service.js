const { findTsconfig } = require('./find-tsconfig');
const { getTypeScriptLanguageServiceHost } = require('./service-host');

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
		let vueTscDir;
		try {
			const path = require('path');
			vueTscDir = path.dirname(require.resolve('vue-tsc/package.json'));
		} catch {
			console.error('Please install vue-tsc to format Vue files.');
		}
		if (vueTscDir) {
			const { createProxyLanguageService, decorateLanguageServiceHost } = require(require.resolve('@volar/typescript', { paths: [vueTscDir] }));
			const { createLanguage, createVueLanguagePlugin, FileMap, createParsedCommandLine, resolveVueCompilerOptions } = require(require.resolve('@vue/language-core', { paths: [vueTscDir] }));
			const { initialize, proxy } = createProxyLanguageService(languageService);
			const tsconfig = findTsconfig(filepath);
			const vueLanguagePlugin = createVueLanguagePlugin(
				ts,
				s => s,
				() => '',
				() => false,
				langaugeServicehost.getCompilationSettings(),
				tsconfig
					? createParsedCommandLine(ts, ts.sys, tsconfig).vueOptions
					: resolveVueCompilerOptions({})
			)
			const language = createLanguage([vueLanguagePlugin], new FileMap(ts.sys.useCaseSensitiveFileNames), () => { });
			const snapshot = langaugeServicehost.getScriptSnapshot(filepath);
			if (snapshot) {
				language.scripts.set(filepath, snapshot);
			}
			initialize(language);
			decorateLanguageServiceHost(ts, language, langaugeServicehost)
			languageService = proxy;
		}
	}

	return languageService;
};

module.exports = { getLanguageService };
