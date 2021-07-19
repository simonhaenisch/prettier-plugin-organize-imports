const ts = require('typescript');

const { applyTextChanges } = require('./apply-text-changes');
const { ServiceHost } = require('./service-host');

/**
 * Organize the given code.
 *
 * @param {string} code
 * @param {string} fileName
 */
module.exports.organize = (code, fileName) => {
	const languageService = ts.createLanguageService(new ServiceHost(fileName, code));

	const fileChanges = languageService.organizeImports({ type: 'file', fileName }, {}, {})[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};
