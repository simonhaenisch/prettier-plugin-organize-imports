const prettier = require('prettier');
const { macro } = require('ava').default;

/**
 * @param {string} code
 * @param {prettier.Options} [options]
 */
module.exports.prettify = async (code, options) =>
	prettier.format(code, { plugins: ['./index.js'], filepath: 'file.ts', ...options });

/**
 * @param {prettier.Options['parser']} parser
 */
module.exports.getMacro = (parser) =>
	macro({
		/**
		 * @param {import('ava').ExecutionContext} t
		 * @param {string} input
		 * @param {string} expected
		 * @param {{ options?: import('prettier').Options; transformer?: (res: string) => string }} [options]
		 */
		async exec(t, input, expected, { options = {}, transformer = (res) => res.split('\n')[0] } = {}) {
			const formattedCode = await module.exports.prettify(input, { parser, ...options });

			t.is(transformer(formattedCode), expected);
		},
		title(providedTitle = '<missing-title>') {
			return `[${parser}] ${providedTitle}`;
		},
	});
