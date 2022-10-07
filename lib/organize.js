const { sep, posix } = require('path');
const { applyTextChanges } = require('./apply-text-changes');
const { getLanguageService } = require('./get-language-service');

/**
 * Organize the given code.
 *
 * @param {string} code
 * @param {import('prettier').ParserOptions} options
 */
module.exports.organize = (
	code,
	{ filepath = 'file.ts', organizeImportsSkipDestructiveCodeActions, parentParser, parser },
) => {
	if (parentParser === 'vue') {
		return code; // we do the preprocessing from the `vue` parent parser instead, so we skip the child parsers
	}

	if (sep !== posix.sep) {
		filepath = filepath.split(sep).join(posix.sep);
	}

	const languageService = getLanguageService(parser, filepath, code);

	const fileChanges = languageService.organizeImports(
		{ type: 'file', fileName: filepath, skipDestructiveCodeActions: organizeImportsSkipDestructiveCodeActions },
		{},
		{},
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};
