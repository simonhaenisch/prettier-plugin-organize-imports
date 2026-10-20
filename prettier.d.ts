import ts = require('typescript');

declare module 'prettier' {
	interface Options {
		organizeImportsSkipDestructiveCodeActions?: boolean;
		organizeImportsTypeOrder?: ts.OrganizeImportsTypeOrder;
		organizeImportsIgnoreCase?: boolean;
	}
	interface ParserOptions {
		organizeImportsSkipDestructiveCodeActions?: boolean;
		organizeImportsTypeOrder?: ts.OrganizeImportsTypeOrder;
		organizeImportsIgnoreCase?: boolean;
	}
}

export {};
