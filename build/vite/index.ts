import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import progress from 'vite-plugin-progress'
import EslintPlugin from 'vite-plugin-eslint'
import PurgeIcons from 'vite-plugin-purge-icons'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
// @ts-ignore
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import topLevelAwait from 'vite-plugin-top-level-await'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

export function createVitePlugins() {
  const root = process.cwd()

  // 路径查找
  function pathResolve(dir: string) {
    return resolve(root, '.', dir)
  }

  return [
    /*
      1. 概述:
      * @vitejs/plugin-vue 是 Vite 中用于处理 Vue 文件的核心插件，它可以帮助你快速地将 Vue 组件中的模板、脚本和样式处理为 Vite 可以理解的格式
      * 同时还支持 TypeScript、Vue 3 的新特性和热更新等功能
    */
    Vue(),
    /*
      1. 概述:
      * @vitejs/plugin-vue-jsx 是 Vite 官方提供的 Vue 3 插件，专门用于在 Vue 项目中支持 JSX 语法。
      * 这使得开发者可以在 Vue 组件中直接使用 JSX 编写模板，而不需要使用传统的 Vue 模板语法（HTML 风格的模板）。
      2. 功能概述:
      * 支持 JSX 语法：通过 @vitejs/plugin-vue-jsx 插件，你可以在 Vue 组件的 <script> 部分使用 JSX，类似于 React 中的写法。
      * 与 Vue 3 兼容：Vue 3 本身原生支持 JSX，而这个插件提供了将 JSX 与 Vue 组件的其他功能（如响应式数据、生命周期钩子等）结合的能力。
      * 支持 TypeScript：该插件支持 TypeScript 和 JSX 的结合，在 Vue 3 中使用 TypeScript 和 JSX 时可以享受类型提示和检查。
      * 自动热更新（HMR）：在开发模式下，插件能够处理 Vue 文件中的 JSX 更新，并触发热更新（HMR），使得开发体验更加流畅。
      3. 注意事项:
      * lang="tsx"：如果你在 Vue 中使用 TypeScript 和 JSX，需要将 <script> 标签的 lang 属性设置为 tsx，而不是 ts。这样 Vite 会知道你在使用 TypeScript 和 JSX。
      * JSX 和 Vue 模板的差异：
        - JSX 并不完全等同于 Vue 的模板语法。虽然它看起来类似于 HTML，但在语法上有一些区别，特别是在处理事件、指令（如 v-bind、v-if）等方面。你需要在 JSX 中手动处理这些差异。
    */
    VueJsx(),
    /*
      1. 概述: unocss 是一个原子化 CSS 框架，它支持按需生成 CSS 类，可以极大地提高项目的性能和开发效率。它与 Vite 配合使用时，能够实现更快速的构建，并且可以灵活地定制和扩展。
      2. 配置: unocss 可以通过 unocss.config.ts 或 unocss.config.js 进行进一步的配置，来定制你项目的设计系统（如颜色、间距等），并支持插件扩展。
      3. 特性和优势
        * 按需生成 CSS：unocss 只会生成页面中实际使用到的 CSS 类，而不会包含未使用的类，这样大大减少了 CSS 文件的大小。
        * 即时生效：借助 Vite 的快速热重载，unocss 可以即时应用类的变化，无需重新编译。
        * 灵活性：unocss 支持自定义主题、快捷方式、插件等，帮助你构建符合项目需求的设计系统。
        * 兼容性：unocss 兼容大部分现代前端框架，如 Vue、React、Svelte 等。
    */
    UnoCSS(),
    // 用于在 Vite 构建过程中显示一个进度条。这个插件可以帮助开发者在长时间的构建过程中提供反馈，显示当前构建的进度，增加用户的可用性体验
    progress(),
    /*
      1. 自动清除未使用的图标，尤其是在使用图标库（如 iconify、vite-plugin-icons 等）时，可以有效地减小最终打包文件的大小。这个插件通过分析你的项目中实际使用的图标，
      移除那些未被引用的图标，从而优化打包结果
    */
    PurgeIcons(),
    /*
      1. 概述: unplugin-element-plus 插件提供了一些功能，使得在 Vite 项目中使用 Element Plus 更加高效，特别是在按需加载和减少打包体积方面。
      2. 插件的主要功能
        * 按需加载：插件会通过解析项目中的代码，自动导入你使用的 Element Plus 组件，并且只打包你实际用到的部分。这样可以避免将整个 Element Plus 库打包进最终产物，减少打包文件的大小。
        * 自动导入样式：在引入组件的同时，插件也会自动处理样式的引入。你不需要再手动去导入 Element Plus 的样式文件，插件会确保所有必需的样式都被正确加载。
        * 优化构建过程：该插件使得使用 Element Plus 组件时，不需要手动配置按需加载或者样式处理，优化了开发体验和构建性能。
    */
    ElementPlus({}),
    /*
      1. 概述:
        * 用于在项目中自动导入常用的模块、API 或函数，避免手动逐个导入。这不仅能够减少重复的导入语句，还能优化代码结构，提升开发效率。
        * 特别适用于需要频繁使用一些常用库（如 vue 的 ref、reactive，vue-router 等）时。
    */
    AutoImport({
      // 指定了需要自动导入的文件类型。它是一个正则表达式的数组，表示哪些文件类型需要进行自动导入
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, // .vue 文件
        /\.vue\?vue/,  // 处理 vue 文件中的 `?vue` 查询参数的情况
        /\.md$/ // .md 文件（Markdown 文件）
      ],
      // 用于指定自动导入的模块。你可以配置常用的 API、工具函数、组件等
      imports: [
        'vue',
        'vue-router',
        // 自定义模块的自动导入配置
        {
          '@/hooks/web/useI18n': ['useI18n'],
          '@/hooks/web/useMessage': ['useMessage'],
          '@/hooks/web/useTable': ['useTable'],
          '@/hooks/web/useCrudSchemas': ['useCrudSchemas'],
          '@/utils/formRules': ['required'],
          '@/utils/dict': ['DICT_TYPE']
        }
      ],
      // 为自动导入生成 TypeScript 类型声明文件（.d.ts）。指定一个路径来存放自动生成的声明文件，通常是为了在 TypeScript 项目中更好地支持类型检查
      dts: 'src/types/auto-imports.d.ts',
      // 允许你指定一个或多个解析器，以便更好地处理一些特定的自动导入需求。例如，使用 ElementPlusResolver 来自动导入 Element Plus 组件库中的组件。
      resolvers: [ElementPlusResolver()],
      // 控制是否为自动导入的模块生成 ESLint 配置文件，以及 ESLint 配置文件的路径
      eslintrc: {
        // 是否启用 ESLint 配置生成，默认false
        enabled: false,
        // 指定 ESLint 配置生成的路径，默认为./.eslintrc-auto-import.json
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        /*
          指定自动导入的模块是否作为全局变量。可选值如下
          1. true：默认值，所有自动导入的模块都会被视为全局变量，并且 ESLint 会假设这些模块已经在全局范围内定义。
          这意味着 ESLint 会允许你在任何文件中直接使用这些模块，而不会提示“未定义变量”的错误。
          2. false: 不将自动导入的模块视为全局变量，ESLint 会提示未定义错误
          3. 'readonly': 将自动导入的模块视为只读的全局变量，不能修改。
          4. 'writable' 或 'writeable': 将自动导入的模块视为可修改的全局变量（不常用）。
        */
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),
    /*
      1. 概述：
        * 用于在 Vite 项目中自动按需导入 Vue 组件的插件，旨在减少手动导入组件的烦恼，提高开发效率。
        * 它通过分析 .vue 文件中的组件使用情况，自动将组件按需导入，而无需显式地在每个文件中写 import 语句。
    */
    Components({
      // 指定自动生成组件的类型声明文件的路径和名称
      dts: 'src/types/auto-components.d.ts',
      // 自定义组件的解析器，这里是和ElementPlus插件集成
      resolvers: [ElementPlusResolver()],
      /*
        是用来指定文件匹配模式的，它通常用于定义哪些文件应该被包含在内，哪些文件应该被排除
        1. 第一个是包含src/components中自定义组件
        2. 第二个是排除src/components/DiyEditor/components/mobile目录下的自定义组件
      */
      globs: ["src/components/**/**.{vue, md}", '!src/components/DiyEditor/components/mobile/**']
    }),
    /*
      1. 概述：旨在集成 ESLint 到 Vite 构建过程中，以便在开发过程中进行代码静态分析和检查，确保代码符合预设的代码风格、规范以及避免潜在的错误。
      2. 插件功能
        * 实时 lint 检查：它可以在开发过程中实时运行 ESLint，帮助开发者尽早发现代码中的问题。
        * 与 Vite 集成：vite-plugin-eslint 作为 Vite 插件使用，能够无缝集成到 Vite 开发流程中，通常不需要额外的配置来启动 ESLint。
        * 支持 Vue 和 TypeScript：如果你的项目中包含 Vue 文件（.vue）或 TypeScript 文件（.ts，.tsx），vite-plugin-eslint 也能够对这些文件进行 lint 检查。
        * 支持自动修复：与 ESLint 配合使用时，可以启用自动修复功能，自动格式化代码，减少人工修复的工作量。
    */
    EslintPlugin({
      // 是否启用 ESLint 缓存，以提高性能。默认值为 false。
      cache: false,
      // 用于指定哪些文件需要执行 ESLint 检查，默认情况下它会检查 src 目录下的 .js、.ts、.tsx、.vue 文件。
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
    }),
    /*
      1. 概述：用于集成 Vue I18n 国际化功能到 Vue 3 项目中。它通过优化 Vue I18n 的加载流程，为开发者提供按需加载、多语言支持、编译优化等功能，提升国际化开发的效率和性能。
      2. 功能特点
        * 简化语言包的加载流程：无需手动导入语言文件。
        * 支持按需加载：提升性能，减少打包体积。
        * 兼容多种语言文件格式：支持 .json 和 .yaml。
        * 易于配置和集成：与 Vue 3 和 Composition API 无缝集成。
    */
    VueI18nPlugin({
      // 是否仅使用运行时模式（即不包含编译器）。开启后可以减少打包体积。默认值true
      runtimeOnly: true,
      // 是否仅使用 Vue I18n 的 Composition API。默认值true
      compositionOnly: true,
      /*
        1.指定语言文件的路径，用于告诉插件从哪里加载国际化资源文件。
        2. __dirname
          * __dirname 是 Node.js 中的一个全局变量，它表示当前模块（文件）所在的目录的绝对路径。
          * 在 Vite 配置中，__dirname 用来获取当前配置文件所在的目录，并结合其他路径字符串来构造绝对路径。
          * 这里的__dirname解析为/Users/consul/workspace/backend/my/ruoyi-all/yudao-ui-admin-vue3/，然后拼接相对路径src/locales/**
      */
      include: [resolve(__dirname, 'src/locales/**')]
    }),
    /*
      1. 概述
        * 官网: https://github.com/vbenjs/vite-plugin-svg-icons/tree/main
        * 用于优化和自动化处理 SVG 图标，将 SVG 文件作为图标使用。
        * 这个插件主要目的是将 SVG 文件转换为 Vue 组件，并提供按需加载功能，从而让你在 Vue 项目中方便地使用 SVG 图标，提升性能并简化图标的管理。
      2. 功能特点
        * 按需加载 SVG 图标：只会加载你使用的图标，避免不必要的资源加载，减少应用的打包体积。
        * 支持自动化处理 SVG 图标：无需手动编写图标组件，自动将 SVG 文件转换为 Vue 组件，简化开发流程。
        * 灵活配置：可以自定义图标目录、SVG 组件的 ID 格式以及图标的注入方式。
        * 提高性能：通过按需加载和优化 SVG 图标的注入位置，提升应用性能。
      3. 项目中使用
        * 原理：详见src/components/Icon中对其的二次封装
        * 如何使用：
          - <Icon :size="40" icon="svg-icon:peoples" />
          - <Icon :size="40" icon="svg-icon:bpm-audit1" />

    */
    createSvgIconsPlugin({
      // 指定图标文件夹路径
      iconDirs: [pathResolve('src/assets/svgs')],
      /*
        1. 指定生成的 SVG symbol 的 ID 格式
        2. 默认格式: icon-[name]
        3. icon-[dir]-[name] 其中[dir]表示图标文件所在的目录名。这个目录名是相对于 iconDirs 配置项所指定的目录的相对路径。
      */
      symbolId: 'icon-[dir]-[name]',
      /*
        自动使用 SVGO 的默认优化选项来优化 SVG 文件。这包括：
          * 删除空白、注释、冗余的属性：比如移除多余的空格、title 标签、id 和 class 等。
          * 缩小文件大小：通过压缩路径数据、优化填充属性和颜色等。
          * 保持必要的属性：例如，默认不会删除 viewBox，因为它对于响应式的 SVG 很重要。
      */
      svgoOptions: true
    }),
    /*
      1. 概述：用于自动对构建后的资源进行压缩，以减小文件大小，提升性能，尤其是对于静态资源的加载速度。这个插件支持多种压缩算法，包括 gzip、brotli 等。
      2. 主要功能
        * 压缩静态资源：将生成的 JS、CSS、HTML 等文件进行压缩，减小文件体积。
        * 支持多种压缩算法：支持常见的压缩算法如 gzip、brotli 和 zlib 等。
        * 自动生成压缩文件：在构建过程中，自动生成相应的压缩文件，并且可以根据需要自动在 HTTP 服务器中提供这些文件。
        * 提高加载速度：压缩文件可以减少传输的数据量，提升客户端加载速度，尤其是在网络带宽有限的情况下。

    */
    viteCompression({
      // 是否在控制台输出压缩结果
      verbose: true,
      // 是否禁用
      disable: false,
      // 体积大于 threshold 才会被压缩,单位 b。10240即为10kb
      threshold: 10240,
      // 指定压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      algorithm: 'gzip',
      // 生成的压缩包后缀
      ext: '.gz',
      //压缩后是否删除源文件
      deleteOriginFile: false
    }),
    /*
      1. 概述：
        * Vite 构建过程中集成 EJS 模板引擎的插件。
        * EJS 是一种非常流行的 JavaScript 模板引擎，允许你在 HTML 文件中嵌入 JavaScript 代码。
        * 通过使用这个插件，你可以在 Vite 项目中方便地处理 EJS 模板文件，动态注入数据并生成最终的 HTML 文件。
    */
    ViteEjsPlugin(),
    /*
      1. 背景
        * 在现代 JavaScript 中，await 只能在 async 函数内部使用，或者通过 Promise.then() 链式调用。
        * 然而，随着 ECMAScript 2022（ES13）的发布，JavaScript 提供了顶级 await 语法，可以直接在模块级别使用 await，这意味着我们不再需要将异步操作包装在函数中。
        ```js
          // ES2022 顶级 await 示例
          const data = await fetchData();
          console.log(data);
        ```
      2. 为什么需要 vite-plugin-top-level-await？
        * Vite 默认不支持顶级 await 语法，尤其是在使用早期版本的 JavaScript 引擎时。在许多情况下，开发者希望在模块级别直接使用 await，而无需将其包装在 async 函数中。
        * vite-plugin-top-level-await 插件解决了这个问题，它允许你在 Vite 构建的项目中使用顶级 await，并且确保它在浏览器端或 Node.js 中正确地被处理。
        * 配置完插件之后，你就可以在项目的任何模块中使用顶级 await：
        ```js
          // 代码会在模块加载时直接执行，await 会等待 fetch 返回的 Promise 解析完成后再继续执行。
          const response = await fetch('https://api.example.com/data');
          const data = await response.json();
          console.log(data);
        ```
      3. https://juejin.cn/post/7152191742513512485
    */
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
    })
  ]
}
