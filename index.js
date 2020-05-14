const { parsers: typescriptParsers } = require('prettier/parser-typescript');
const ts = require('typescript');
const { getCompilerOptionsFromTsConfig, Project } = require('ts-morph');

const getCompilerOptions = (fileName) => {
	const tsconfig = ts.findConfigFile(fileName, ts.sys.fileExists);

	if (tsconfig) {
		return getCompilerOptionsFromTsConfig(tsconfig);
	}
};

/**
 * Organize the imports using the `organizeImports` feature of the TypeScript language service API.
 *
 * @param {string} text
 * @param {import('prettier').Options} options
 */
const organizeImports = (text, options) => {
	const fileName = options.filepath || 'file.ts';

	const compilerOptions = getCompilerOptions(fileName);

	const project = new Project({
		compilerOptions,
		useInMemoryFileSystem: true,
	});
	const fs = project.getFileSystem();
	const sourceFile = project.createSourceFile(fileName, text);
	sourceFile.organizeImports();
	sourceFile.saveSync();
	return fs.readFileSync(fileName);
};

exports.parsers = {
	typescript: {
		...typescriptParsers.typescript,
		preprocess: typescriptParsers.typescript.preprocess
			? (text, options) => organizeImports(typescriptParsers.typescript.preprocess(text, options), options)
			: organizeImports,
	},
};
