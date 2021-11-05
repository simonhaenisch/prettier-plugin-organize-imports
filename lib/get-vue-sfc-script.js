/**
 * Get the script block of a Vue SFC.
 *
 * @param {string} source
 * @param {string} filename
 */
module.exports.getVueSFCScript = (source, filename) => {
	try {
		const { parse } = require('@vue/compiler-sfc');

		const {
			descriptor: { script, scriptSetup },
		} = parse(source);

		const result = {};

		if (script) {
			result.script = {
				content: script.content,
				start: script.loc.start.offset,
				end: script.loc.end.offset,
			};
		}

		if (scriptSetup) {
			result.scriptSetup = {
				content: scriptSetup.content,
				start: scriptSetup.loc.start.offset,
				end: scriptSetup.loc.end.offset,
			};
		}

		return result;
	} catch (error) {
		try {
			const { parse: parse2 } = require('@vue/component-compiler-utils');
			const compiler = require('vue-template-compiler');

			const { script } = parse2({ compiler, compilerParseOptions: { pad: 'space' }, source, filename });

			return { script };
		} catch (error2) {
			if (process.env.DEBUG) {
				console.error(error);
				console.error(error2);
			}
		}
	}
};
