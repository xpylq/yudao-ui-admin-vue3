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
    Components({
      // 生成自定义 `auto-components.d.ts` 全局声明
      dts: 'src/types/auto-components.d.ts',
      // 自定义组件的解析器
      resolvers: [ElementPlusResolver()],
      globs: ["src/components/**/**.{vue, md}", '!src/components/DiyEditor/components/mobile/**']
    }),
    EslintPlugin({
      cache: false,
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve(__dirname, 'src/locales/**')]
    }),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svgs')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: true
    }),
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用
      threshold: 10240, // 体积大于 threshold 才会被压缩,单位 b
      algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: '.gz', // 生成的压缩包后缀
      deleteOriginFile: false //压缩后是否删除源文件
    }),
    ViteEjsPlugin(),
    topLevelAwait({
      // https://juejin.cn/post/7152191742513512485
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
    })
  ]
}
