const ts = require('typescript');

const { getCompilerOptions } = require('./get-compiler-options');

/**
 * Create the most basic language service host for the given file to make import sorting work.
 *
 * @param {string} path path to file
 * @param {string} content file's content
 *
 * @returns {ts.LanguageServiceHost}
 */
const getLanguageServiceHost = (path, content) => {
	const tsconfig = ts.findConfigFile(path, ts.sys.fileExists);

	const compilerOptions = getCompilerOptions(tsconfig);

	return {
		directoryExists: ts.sys.directoryExists,
		fileExists: ts.sys.fileExists,
		getCurrentDirectory: ts.sys.getCurrentDirectory,
		getDefaultLibFileName: ts.getDefaultLibFileName,
		getDirectories: ts.sys.getDirectories,
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
		getCompilationSettings: () => compilerOptions,
		getNewLine: () => ts.sys.newLine,
		getScriptFileNames: () => [path],
		getScriptVersion: () => '0',
		getScriptSnapshot: (filePath) => {
			if (filePath === path) {
				return ts.ScriptSnapshot.fromString(content);
			}
		},
	};
};

/**
 * Get a Language Service Host for Vue support, that has some extra methods needed by `@volar/vue-typescript`.
 *
 * @typedef {import('@volar/vue-language-core/out/types').LanguageServiceHost} VueLanguageServiceHost
 *
 * @param {string} path path to file
 * @param {string} content file's content
 *
 * @returns {VueLanguageServiceHost}
 */
const getVueLanguageServiceHost = (path, content) => ({
	...getLanguageServiceHost(path, content),
	getVueCompilationSettings: () => ({}),
	/**
	 * Can return either `require('typescript')` or `require('typescript/lib/tsserverlibrary')`.
	 *
	 * @see https://github.com/simonhaenisch/prettier-plugin-organize-imports/pull/60#discussion_r934408179
	 *
	 * @returns {any}
	 */
	getTypeScriptModule: () => ts,
});

module.exports = { getLanguageServiceHost, getVueLanguageServiceHost };
