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
    let env = {} as any
    const isBuild = command === 'build'
    if (!isBuild) {
        env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
    } else {
        env = loadEnv(mode, root)
    }
    return {
        base: env.VITE_BASE_PATH,
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
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/styles/variables.scss" as *;',
                    javascriptEnabled: true
                }
            }
        },
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
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
