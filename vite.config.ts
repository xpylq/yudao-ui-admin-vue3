import {resolve} from 'path'
import type {ConfigEnv, UserConfig} from 'vite'
import {loadEnv} from 'vite'
import {createVitePlugins} from './build/vite'
import {exclude, include} from "./build/vite/optimize"
// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

// 路径查找
function pathResolve(dir: string) {
    return resolve(root, '.', dir)
}

// https://vitejs.dev/config/
export default ({command, mode}: ConfigEnv): UserConfig => {
    // 加载环境变量中的配置
    let env = {} as any
    const isBuild = command === 'build'
    if (!isBuild) {
        /**
         * 1. 环境变量文件
         *  * 概述: 在 Vite 中，环境变量通常存储在以 .env 为后缀的文件中，例如 .env, .env.local, .env.production, .env.development 等
         *  * 注意事项:
         *    - Vite 一定会加载 .env 文件，因此里面放一些不同环境都通用得配置
         *    - Vite 强制要求环境变量的键以 VITE_ 为前缀，这样它才能被嵌入到客户端代码中
         * 2. loadEnv(mode,path)
         *  * 概述: 在 Vite 中，loadEnv 是一个用于加载环境变量的工具函数。它允许你在 Vite 配置文件中访问 .env 文件中的环境变量
         *  * 参数
         *    - mode: 当前的环境模式，其值为 Vite 构建的时候 --mode 参数指定的环境。如果传入dev，则会加载 .env.production 文件
         *    - path: 指定从哪个目录开始加载 .env 文件中的环境变量。一般传入process.cwd()，也就是获取当前 Node.js 进程的工作目录
         */
        env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
    } else {
        env = loadEnv(mode, root)
    }
    console.log(`加载的环境:${mode}`)
    return {
        /**
         * 1. 概述: base 用于指定应用的 基础公共路径，它决定了生产环境下所有资源（如 JavaScript、CSS、图片等）相对于哪个 URL 路径加载
         * 2. 常见用法:
         *    * 开发环境或应用部署在服务器根目录: /（也是 base 的默认值）
         *    * 将应用部署到 https://example.com/my-app/ : /my-app/
         */
        base: env.VITE_BASE_PATH,
        /**
         * 1. 概述: root 配置项的主要功能是设置项目的根目录，影响以下方面：
         *  * 入口文件的位置：index.html 文件的查找路径会基于 root
         *  * 静态资源路径：Vite 会将 root 作为起点解析静态资源的相对路径
         *  * 依赖解析：root 决定了依赖文件的解析基准
         * 2. 如果你没有指定 root，Vite 会默认将当前工作目录（process.cwd()）作为项目的根目录。
         */
        root: root,
        // 服务端渲染
        server: {
            port: env.VITE_PORT, // 端口号
            host: "0.0.0.0",
            // 是否自动打开浏览器
            open: env.VITE_OPEN === 'true',
            // 本地跨域代理. 目前注释的原因：暂时没有用途，server 端已经支持跨域
            // proxy: {
            //   ['/admin-api']: {
            //     target: env.VITE_BASE_URL,
            //     ws: false,
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(new RegExp(`^/admin-api`), ''),
            //   },
            // },
        },
        // 项目使用的vite插件。 单独提取到build/vite/plugin中管理
        plugins: createVitePlugins(),
        css: {
            /**
             * 用于为 CSS 预处理器（如 SCSS、SASS、LESS 等）提供额外的选项。
             * 通过这个选项，你可以自定义预处理器的行为，方便在全局样式中共享变量、混入、函数等。
             */
            preprocessorOptions: {
                // scss 是 Vite 配置的一个子项，用于专门配置 SCSS 相关的选项。SCSS 是 Sass 的一种语法，可以用来编写更简洁、结构化的 CSS。
                scss: {
                    /**
                     * additionalData 是一个 SCSS 配置项，用于向每个 SCSS 文件的开头注入一些内容。
                     * 在 Vite 中，你可以利用 additionalData 自动在每个 SCSS 文件的开头添加一些全局变量、混入或导入的内容，从而避免在每个 SCSS 文件中重复导入相同的内容。
                     * @use 是 SCSS 中引入其他 SCSS 文件的语法，用于引入 variables.scss 文件
                     * @use "@/styles/variables.scss" as *; 将 variables.scss 中的内容引入，并使用 as * 表示把文件中的所有变量、混入、函数等作为全局内容引入，这样你就可以在任何 SCSS 文件中直接使用它们。
                     */
                    additionalData: '@use "@/styles/variables.scss" as *;',
                    javascriptEnabled: true
                }
            }
        },
        // 主要用于模块解析的定制，允许你指定文件扩展名的解析顺序和配置路径别名
        resolve: {
            /**
             * extensions 用于指定模块解析时的文件扩展名顺序。当你导入模块时，Vite 会依次尝试这些扩展名。
             * 这个配置可以帮助你在导入模块时省略扩展名，Vite 会自动根据这些扩展名的顺序去查找相应的文件。
             * 通过这个配置，你在导入模块时可以省略扩展名，例如：
             * import { something } from './myModule';  // 可以不写 .js, .ts, .jsx, 等扩展名
             */
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
            // alias 配置用于设置路径别名，这样可以简化模块导入路径
            alias: [
                {
                    find: 'vue-i18n',
                    replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
                },
                {
                    find: /\@\//,
                    replacement: `${pathResolve('src')}/`
                }
            ]
        },
        build: {
            /**
             * 1. minify 选项用于控制构建输出的压缩方式，即是否对生成的 JavaScript 代码进行压缩优化
             * 2. minify：
             *  * false（默认值）：不进行压缩，生成的代码保持原样，不进行任何压缩优化。适用于开发环境，通常会选择此选项以便更好地调试代码。
             *  * true：启用默认的压缩模式。在生产环境下，Vite 会默认使用 esbuild（一个高效的 JavaScript 打包工具）进行压缩。esbuild 是非常快的，通常可以在几秒钟内完成代码压缩。
             *  * terser：
             *    - 使用 Terser 进行压缩。Terser 是一个广泛使用的 JavaScript 压缩工具，比 esbuild 更强大，支持更多的压缩选项和高级功能（如代码混淆、删除无用的代码等）。
             *    - 如果你需要更细粒度的压缩控制（例如更复杂的代码混淆），可以使用 terser。
             * 3. esbuild vs terser
             *  * 压缩效果：
             *    - esbuild 提供了一个快速的压缩选项，但它的压缩功能相对简单（比如去除空格、删除注释、压缩变量名）。
             *    - terser 作为一个更强大的压缩工具，除了提供常见的压缩功能外，还能进行更复杂的代码混淆、删除死代码等操作。
             *  * 构建速度：
             *    - esbuild 比 terser 快得多，因为 esbuild 是基于 Go 语言编写的，速度极快。因此，如果只需要基本的压缩，使用 esbuild 会比 terser 更加高效。
             *    - terser 的压缩速度相对较慢，但它提供了更多的压缩功能。
             *  * 生产环境构建：
             *    - 在生产环境中，通常建议开启压缩，通常会选择 minify: true 或 minify: 'terser' 来减小构建输出的文件大小，提高页面加载速度。
             *    - 开发环境中通常不需要压缩（minify: false），这样可以使代码更容易调试。
             */
            minify: 'terser',
            outDir: env.VITE_OUT_DIR || 'dist',
            /**
             * 1. sourceMap 是一种映射文件，它可以将编译后的代码（如 JavaScript、CSS 或其他语言）与原始源代码之间建立映射关系。它的作用主要是在
             * 调试时提供原始源代码的信息，帮助开发者更方便地追踪和调试
             * 2. 可选值：
             *  * false（默认值）：不生成源映射文件。使用此选项时，生成的代码中不会包含 source map。
             *  * true：生成源映射文件，并将其与输出的文件一起保存。适用于开发和调试过程中，可以帮助开发者在浏览器的开发者工具中查看原始代码。
             *  * inline：将源映射嵌入到生成的 JavaScript 文件中，而不是生成单独的 .map 文件。适用于需要将源映射直接嵌入文件的情况，避免单独的 .map 文件。
             *  * hidden：生成源映射文件，但不将它们暴露在最终的输出文件中。适用于只希望生成源映射，但不希望它们在浏览器调试时直接显示或公开的场景。
             */
            sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
            // brotliSize: false,
            terserOptions: {
                compress: {
                  // 删除 debugger 语句
                    drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
                    // 删除所有的 console.* 调用
                    drop_console: env.VITE_DROP_CONSOLE === 'true'
                },
                output:{
                  // 删除所有注释
                  comments: env.VITE_DEV!=='true'
                },
                mangle: {
                  // 混淆顶级作用域的变量和函数名
                  toplevel:  env.VITE_DEV!=='true'
                },
                // 不保留函数名
                keep_fnames: env.VITE_DEV!=='true'
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        echarts: ['echarts'] // 将 echarts 单独打包，参考 https://gitee.com/yudaocode/yudao-ui-admin-vue3/issues/IAB1SX 讨论
                    }
                },
            },
        },
        optimizeDeps: {include, exclude}
    }
}
