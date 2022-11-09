const { dirname } = require('path');
const ts = require('typescript');

/**
 * Get the compiler options from a path to a file in the project. Returns from in-memory cache if they have been read already.
 *
 * @param {string} path path to a file in the project
 */
module.exports.getCompilerOptions = (path) => {
	const tsconfig = findTsconfig(path);

	const cachedCompilerOptions = compilerOptionsCache.get(tsconfig);

	if (cachedCompilerOptions) {
		return cachedCompilerOptions;
	}

	const compilerOptions = tsconfig
		? ts.parseJsonConfigFileContent(ts.readConfigFile(tsconfig, ts.sys.readFile).config, ts.sys, dirname(tsconfig))
				.options
		: ts.getDefaultCompilerOptions();

	compilerOptions.allowJs = true; // for automatic JS support

	compilerOptionsCache.set(tsconfig, compilerOptions);

	return compilerOptions;
};

/**
 * Get the Vue compiler options from a path to a file in the project.
 *
 * @param {string} path path to a file in the project
 */
module.exports.getVueCompilerOptions = (path) => {
	const tsconfig = findTsconfig(path);

	const cachedVueCompilerOptions = vueCompilerOptionsCache.get(tsconfig);

	if (cachedVueCompilerOptions) {
		return cachedVueCompilerOptions;
	}

	const vueCompilerOptions = tsconfig
		? require('@volar/vue-language-core').createParsedCommandLine(
				// @ts-ignore
				ts,
				ts.sys,
				tsconfig,
				[],
		  ).vueOptions
		: {};

	vueCompilerOptionsCache.set(tsconfig, vueCompilerOptions);

	return vueCompilerOptions;
};

/**
 * Find the path of the project's tsconfig from a path to a file in the project.
 *
 * @param {string} path path to a file in the project
 */
function findTsconfig(path) {
	const cachedTsconfig = tsconfigCache.get(path);

	if (cachedTsconfig) {
		return cachedTsconfig;
	}

	const tsconfig = ts.findConfigFile(path, ts.sys.fileExists) ?? '';

	tsconfigCache.set(path, tsconfig);

	return tsconfig;
}

/**
 * @type {Map<string, string>}
 */
const tsconfigCache = new Map();

/**
 * @type {Map<string, ts.CompilerOptions>}
 */
const compilerOptionsCache = new Map();

/**
 * @type {Map<string, Partial<import('@volar/vue-language-core').ResolvedVueCompilerOptions>>}
 */
const vueCompilerOptionsCache = new Map();
