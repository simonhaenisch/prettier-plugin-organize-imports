const prettier = require('prettier');

/**
 * @param {string} code
 * @param {prettier.Options} [options]
 */
module.exports.prettify = (code, options) => prettier.format(code, { plugins: ['.'], filepath: 'file.ts', ...options });

/**
 * @param {prettier.Options['parser']} parser
 */
module.exports.getMacro = (parser) => {
	/**
	 * @param {import('ava').Assertions} t
	 * @param {string} input
	 * @param {string} expected
	 * @param {object} options
	 * @param {prettier.Options} [options.options]
	 * @param {(res: string) => string} [options.transformer]
	 */
	function macro(t, input, expected, { options = {}, transformer = (res) => res.split('\n')[0] } = {}) {
		const formattedCode = module.exports.prettify(input, { parser, ...options });

		t.is(transformer(formattedCode), expected);
	}

	/**
	 * @param {string} title
	 */
	macro.title = (title) => `[${parser}] ${title}`;

	return macro;
};
