const { dirname } = require('path');
const ts = require('typescript');
const { findTsconfig } = require('./find-tsconfig');

const { getCompilerOptions } = require('./get-compiler-options');

/**
 * Create the most basic TS language service host for the given file to make import sorting work.
 *
 * @param {string} path path to file
 * @param {string} content file's content
 *
 * @returns {ts.LanguageServiceHost}
 */
function getTypeScriptLanguageServiceHost(path, content) {
	const tsconfig = findTsconfig(path);
	const compilerOptions = getCompilerOptions(tsconfig);

	return {
		directoryExists: ts.sys.directoryExists,
		fileExists: ts.sys.fileExists,
		getDefaultLibFileName: ts.getDefaultLibFileName,
		getDirectories: ts.sys.getDirectories,
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
		getCurrentDirectory: () => (tsconfig ? dirname(tsconfig) : ts.sys.getCurrentDirectory()),
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
}

/**
 * Get a Language Service Host for Vue support.
 *
 * @param {ts.CompilerOptions} compilerOptions compiler options
 * @param {string} filepath file's name
 * @param {string} code file's content
 *
 * @returns {import('@vue/language-core').TypeScriptProjectHost}
 */
function getVueTypeScriptProjectHost(compilerOptions, filepath, code) {
	return {
		...ts.sys,
		configFileName: undefined,
		getCurrentDirectory: () => '/',
		getProjectVersion: () => '0',
		getScriptFileNames: () => [filepath],
		getCompilationSettings: () => compilerOptions,
		getScriptSnapshot: (filePath) => {
			if (filePath === filepath) {
				return ts.ScriptSnapshot.fromString(code);
			}
		},
		scriptIdToFileName: (id) => id,
		fileNameToScriptId: (id) => id,
	};
}

module.exports = { getTypeScriptLanguageServiceHost, getVueTypeScriptProjectHost };
