declare module 'prettier' {
	interface Options {
		organizeImportsSkipDestructiveCodeActions?: boolean;
		organizeImportsMode?: 'All' | 'SortAndCombine' | 'RemoveUnused';
	}
	interface ParserOptions {
		organizeImportsSkipDestructiveCodeActions?: boolean;
		organizeImportsMode?: 'All' | 'SortAndCombine' | 'RemoveUnused';
	}
}

export {};
