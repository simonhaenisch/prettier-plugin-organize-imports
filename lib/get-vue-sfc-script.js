/**
 * Get the script block of a Vue SFC.
 *
 * @param {string} source
 * @param {string} filename
 */
module.exports.getVueSFCScript = (source, filename) => {
	try {
		const { parse } = require('@vue/component-compiler-utils');
		const compiler = require('vue-template-compiler');

		const { script } = parse({ compiler, source, filename });

		return script;
	} catch (error) {
		if (process.env.DEBUG) {
			console.error(error);
		}
	}
};
