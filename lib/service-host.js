const ts = require('typescript');

const { getCompilerOptions } = require('./get-compiler-options');

/**
 * The most basic Language Service Host implementation to make import sorting work.
 *
 * @implements {ts.LanguageServiceHost}
 */
class ServiceHost {
	/**
	 * Create a service host instance for the given file.
	 *
	 * @param {string} name path to file
	 * @param {string} content file content
	 */
	constructor(name, content) {
		const tsconfig = ts.findConfigFile(name, ts.sys.fileExists);

		this.fileName = name;
		this.content = content;
		this.compilerOptions = getCompilerOptions(tsconfig);

		this.getDefaultLibFileName = ts.getDefaultLibFileName;
		this.getCurrentDirectory = ts.sys.getCurrentDirectory;
		this.readFile = ts.sys.readFile;
		this.fileExists = ts.sys.fileExists;
	}

	getNewLine() {
		return ts.sys.newLine;
	}

	getCompilationSettings() {
		return this.compilerOptions;
	}

	getScriptFileNames() {
		return [this.fileName];
	}

	getScriptVersion() {
		return 'V1';
	}

	getScriptSnapshot() {
		return ts.ScriptSnapshot.fromString(this.content);
	}
}

/**
 * Language Service Host class for Vue support, that has some extra stuff needed by `@volar/vue-typescript`.
 *
 * @typedef {import('@volar/vue-language-core/out/types').LanguageServiceHost} VueLanguageServiceHost
 * @implements {VueLanguageServiceHost}
 */
class VueServiceHost extends ServiceHost {
	/**
	 * Create a service host instance for the given file.
	 *
	 * @param {string} name path to file
	 * @param {string} content file content
	 */
	constructor(name, content) {
		super(name, content);
	}

	getVueCompilationSettings() {
		return {};
	}

	/**
	 * Can return either `require('typescript')` or `require('typescript/lib/tsserverlibrary')`.
	 *
	 * @see https://github.com/simonhaenisch/prettier-plugin-organize-imports/pull/60#discussion_r934408179
	 *
	 * @returns {any}
	 */
	getTypeScriptModule() {
		return ts;
	}
}

module.exports = { ServiceHost, VueServiceHost };
