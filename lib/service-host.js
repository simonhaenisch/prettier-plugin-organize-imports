const ts = require('typescript');

const { getCompilerOptions } = require('./get-compiler-options');

/**
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

module.exports = { ServiceHost };
