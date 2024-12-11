/*
  1. PostCSS
    * 概述：
      - PostCSS 是一个使用插件来转换 CSS 的工具。
      - 与传统的 CSS 预处理器（如 Sass 或 Less）不同，PostCSS 并不是一种新的 CSS 语言，而是通过插件来实现对 CSS 的增强和优化。
      - 你可以使用 PostCSS 来实现自动添加浏览器前缀、优化 CSS 代码、支持未来的 CSS 语法等
    * 常见的PostCSS插件
      - autoprefixer
        * 是 PostCSS 最流行的插件之一，用于自动根据目标浏览器添加必要的 CSS 前缀。
        * 浏览器厂商有时会为某些 CSS 属性添加前缀以确保新特性在不兼容的情况下仍能正常工作，Autoprefixer 可以大大减少手动添加前缀的工作量。
      - cssnano：是一个用于压缩 CSS 文件的 PostCSS 插件。它通过移除空格、注释、多余的代码等方式来优化 CSS 文件大小，从而提升页面加载速度
      - postcss-preset-env：是 PostCSS 的一个强大的预设插件集，它允许你使用最新的 CSS 特性，并自动将其转译为当前浏览器兼容的 CSS
  2. 在 Vite 中使用 PostCSS
    * Vite 默认支持 PostCSS，因此你无需安装额外的配置工具。只需要在项目根目录下创建一个 postcss.config.js 文件，并在其中配置所需的插件。
    * 集成步骤
      - 第一步：pnpm install postcss autoprefixer
      - 第二步：在项目根目录下创建并配置 postcss.config.js 文件
        ```js
          module.exports = {
            plugins: {
              autoprefixer: {}
            }
          }
        ```
*/
module.exports = {
  plugins: {
    autoprefixer: {}
  }
}
