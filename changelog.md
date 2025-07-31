Version `4.2.0` switches from using `vue-tsc`'s deprecated `resolveVueCompilerOptions` to the new `getDefaultCompilerOptions` instead, which then also allowed bumping the `vue-tsc` peer dependency range to include version 3.

Version `4.1.0` bumps the peer dependency range for `vue-tsc` to `^2.1.0` because there was a breaking change in its API. If you're using Vue support, upgrade both packages simultaneously, e.g. `npm i -D prettier-plugin-organize-imports vue-tsc`.

Version `4.0.0` upgrades/replaces the Volar packages used for Vue support, to use the latest `vue-tsc` package that's part of Volar 2. To migrate, you just have to remove `@volar/vue-typescript` and if you're using it, also `@volar/vue-language-plugin-pug`, and replace it with `vue-tsc` and `@vue/language-plugin-pug` respectively. There are no breaking changes other than this.

Version `3.2.4` implements a fix to skip when formatting ranges (i.e. if the plugin is requested to format a range, it doesn't do anything because it would lack the full file context).

Version `3.2.3` updates the readme with instructions for Prettier 3.

Version `3.2.2` fixes a performance regression introduced in `3.2.0`.

Version `3.2.1` fixes the implementation of the language service host's `getCurrentDirectory` method to return the directory containing the tsconfig, rather than using `ts.sys.getCurrentDirectory` (which returns `process.cwd()`). This should prevent issues with resolving compiler plugins with Volar (which is used for Vue support).

Version `3.2.0` adds and fixes support for pug templates in Vue files (via `@volar/vue-language-plugin-pug`). Please be aware that you'll need to update your version of the `@volar/vue-typescript` peer dependency from `0.x` to `1.x`.

Version `3.1.0` adds an option to skip destructive code actions like removing unused imports.

Version `3.0.3` fixes a performance regression introduced in `3.0.2`.

Version `3.0.2` fixes a regression introduced by adding some file-system related methods to the language service host (to fix a bug), which revealed that another method's implementation was incorrect.

Version `3.0.1` bumps the `@volar/vue-typescript` version to fix more edge cases, e. g. not removing imports when a component is used via kebab-case naming. `@volar/vue-typescript` is now defined as an optional peer dependency and you'll need to install version `0.39` or later. Furthermore a fix has been added that should help support more module resolution algorithms.

Version `3.0.0` switches to a different package for Vue support, which fixes some more issues, e. g. support for setup scripts. No breaking changes otherwise.

Version `2.3.4` fixes an issue with Vue v2 files.

Version `2.3.3` fixes a bug where default imports were removed erroneously.

Version `2.3.1` adds debug logs and fixes Vue.js support.

Version `2.2.0` adds a compiler options cache to improve performance.

Version `2.1.0` adds support for Vue.js (`.vue` files).

Version `2.0.0` adds support for the parsers `babel` (i. e. JavaScript) and `babel-ts` which are only available since Prettier v2 (and thus the peer dependency has received a major bump).
