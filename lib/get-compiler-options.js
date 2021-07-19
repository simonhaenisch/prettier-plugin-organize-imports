const { dirname } = require('path');
const ts = require('typescript');

/**
 * Get the compiler options from a tsconfig path. Returns from in-memory cache if they have been read already.
 */
module.exports.getCompilerOptions = (tsconfig = '') => {
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
 * @type {Map<string, ts.CompilerOptions>}
 */
const compilerOptionsCache = new Map();
