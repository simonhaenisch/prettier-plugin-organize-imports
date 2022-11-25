const { dirname } = require('path');
const ts = require('typescript');
const { findTsconfig } = require('./find-tsconfig');
const { memoize } = require('./memoize');

/**
 * Get the compiler options from a path to a file in the project.
 *
 * @param {string} path path to a file in the project
 */
function getCompilerOptions(path) {
	const tsconfig = findTsconfig(path);

	const compilerOptions = tsconfig
		? ts.parseJsonConfigFileContent(ts.readConfigFile(tsconfig, ts.sys.readFile).config, ts.sys, dirname(tsconfig))
				.options
		: ts.getDefaultCompilerOptions();

	compilerOptions.allowJs = true; // for automatic JS support

	return compilerOptions;
}

module.exports.getCompilerOptions = memoize(getCompilerOptions);

/**
 * Get the Vue compiler options from a path to a file in the project.
 *
 * Uses a dynamic require instead of top-level because this is only needed for Vue.
 *
 * @param {string} path path to a file in the project
 */
function getVueCompilerOptions(path) {
	const tsconfig = findTsconfig(path);

	return tsconfig
		? require('@volar/vue-language-core').createParsedCommandLine(
				// @ts-ignore
				ts,
				ts.sys,
				tsconfig,
				[],
		  ).vueOptions
		: {};
}

module.exports.getVueCompilerOptions = memoize(getVueCompilerOptions);
