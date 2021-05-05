const { parsers: babelParsers } = require('prettier/parser-babel');
const { parsers: typescriptParsers } = require('prettier/parser-typescript');
const ts = require('typescript');

/**
 * Organize the imports using the `organizeImports` feature of the TypeScript language service API.
 *
 * @param {string} text
 * @param {import('prettier').Options} options
 */
const organizeImports = (text, options) => {
	if (text.includes('// organize-imports-ignore') || text.includes('// tslint:disable:ordered-imports')) {
		return text;
	}

	const fileName = options.filepath || 'file.ts';

	const languageService = ts.createLanguageService(new ServiceHost(fileName, text));

	const fileChanges = languageService.organizeImports(
		{ type: 'file', fileName },
		/**
		 * @todo remove one Typescript bug has been resolved
		 * @see https://github.com/microsoft/TypeScript/issues/38548
		 */
		{ newLineCharacter: ts.sys.newLine },
	)[0];

	return fileChanges ? applyChanges(text, fileChanges.textChanges) : text;
};

/**
 * Apply the given set of changes to the text input.
 *
 * @param {string} input
 * @param {ts.TextChange[]} changes set of text changes
 */
const applyChanges = (input, changes) =>
	changes.reduceRight((text, change) => {
		const head = text.slice(0, change.span.start);
		const tail = text.slice(change.span.start + change.span.length);

		return `${head}${change.newText}${tail}`;
	}, input);

class ServiceHost {
	/**
	 * Create a service host instance.
	 *
	 * @param {string} name path to file
	 * @param {string} content file content
	 */
	constructor(name, content) {
		const tsconfig = ts.findConfigFile(name, ts.sys.fileExists);

		const compilerOptions = tsconfig
			? ts.convertCompilerOptionsFromJson(ts.readConfigFile(tsconfig, ts.sys.readFile).config.compilerOptions).options
			: ts.getDefaultCompilerOptions();

		compilerOptions.allowJs = true;

		this.name = name;
		this.content = content;
		this.options = compilerOptions;

		this.getDefaultLibFileName = ts.getDefaultLibFileName;
	}

	getNewLine() {
		return '\n';
	}

	getCurrentDirectory() {
		return process.cwd();
	}

	getCompilationSettings() {
		return this.options;
	}

	getScriptFileNames() {
		return [this.name];
	}

	getScriptVersion() {
		return ts.version;
	}

	getScriptSnapshot() {
		return ts.ScriptSnapshot.fromString(this.content);
	}
}

/**
 * Sets `organizeImports` as the given parsers preprocess step, or merges it with the existing one.
 *
 * @param {import('prettier').Parser} parser prettier parser
 */
const withOrganizeImportsPreprocess = (parser) => {
	return {
		...parser,
		preprocess: parser.preprocess 
			? (text, options) => organizeImports(parser.preprocess(text, options), options) 
			: organizeImports,
	}
}

exports.parsers = {
	babel: withOrganizeImportsPreprocess(babelParsers.babel),
	'babel-ts': withOrganizeImportsPreprocess(babelParsers['babel-ts']),
	typescript: withOrganizeImportsPreprocess(typescriptParsers.typescript),
};
