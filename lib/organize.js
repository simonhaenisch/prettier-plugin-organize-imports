const { sep, posix } = require('path');
const { applyTextChanges } = require('./apply-text-changes');
const { getLanguageServiceHost, getVueLanguageServiceHost } = require('./service-host');

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

	/**
	 * @type {ts.LanguageService}
	 */
	let languageService;

	if (parser === 'vue') {
		languageService = require('@volar/vue-typescript').createLanguageService(getVueLanguageServiceHost(filepath, code));
	} else {
		languageService = require('typescript').createLanguageService(getLanguageServiceHost(filepath, code));
	}

	const fileChanges = languageService.organizeImports(
		{ type: 'file', fileName: filepath, skipDestructiveCodeActions: organizeImportsSkipDestructiveCodeActions },
		{},
		{},
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};
