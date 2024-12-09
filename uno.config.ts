/**
 * 1. defineConfig：这是 unocss 提供的一个方法，用来定义配置，确保配置格式的正确性
 * 2. toEscapedSelector as e：toEscapedSelector 是一个用于转义 CSS 选择器的方法，防止非法字符出现。通过 e 来引入并简化调用
 * 3. presetUno：presetUno 是 unocss 默认的预设，它提供了基础的样式类支持
 */
import { defineConfig, toEscapedSelector as e, presetUno } from 'unocss'
// import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  // rules 用于自定义 CSS 规则，它允许根据正则表达式匹配选择器，然后定义具体的样式
  rules: [
    [
      /**
       *  1. /^custom-hover$/：这是一个正则表达式，用来匹配 custom-hover 类名。正则表达式会匹配所有以 custom-hover 为类名的元素
       *    * /^ 表示以 custom-hover 开头。
       *    * /$/ 表示以 custom-hover 结尾。
       *    * 因此，这个规则只会匹配类名 custom-hover。
       *  2. ([], { rawSelector }) => { ... }：这个箭头函数是规则的回调，它接受两个参数：
       *    * []：这是规则回调的第一个参数，unocss 会传递给它一个匹配的类的值，然而它被留空，不用于该例子。
       *    * { rawSelector }：第二个参数是一个对象，它包含 rawSelector 属性，表示传递进来的原始选择器。这个选择器就是 custom-hover 类名。
       *  3. e(rawSelector) 是对 rawSelector 的处理，它是 unocss 的 toEscapedSelector 方法，通常用于确保 CSS 选择器中的特殊字符（例如 .、#）被正确转义。
       *    * 例如，如果类名是 .custom-hover，e(rawSelector) 会确保它在最终生成的 CSS 代码中被正确转义为 \.，这样可以避免非法字符或命名冲突。
       */
      /^custom-hover$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  display: flex;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  align-items: center;
  transition: background var(--transition-time-02);
}
/* you can have multiple rules */
${selector}:hover {
  background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
  background-color: var(--el-bg-color-overlay);
}
`
      }
    ],
    [
      /^layout-border__left$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__right$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__top$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__bottom$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--el-border-color);
  z-index: 3;
}
`
      }
    ]
  ],
  /**
   *  1. presetUno
   *    * presetUno 是 unocss 提供的一个默认的预设，它包含了一些常用的 CSS 工具类，比如 w-full, h-full, bg-red-500 等。
   *    * 这些工具类可以帮助开发者快速构建布局和样式。使用 presetUno 就等于启用了 unocss 提供的一些基础样式功能。
   *  2. dark: 'class'
   *    * 这个配置项用于启用暗黑模式的支持
   *    * dark: 'class' 表示暗黑模式的切换将通过类名来控制。具体来说，你需要在页面的根元素（例如 html 或 body）上添加一个 .dark 类，来启用暗黑模式样式。
   *    * 使用类名来控制暗黑模式的好处是，它可以通过 JavaScript 动态添加或删除 .dark 类，从而在用户界面中切换暗黑模式。例如，通过点击按钮切换 dark 类，或者根据操作系统的暗黑模式设置自动切换。
   *  3. attributify: 用于控制是否启用“属性化语法”。在 unocss 中，attributify 允许你使用属性形式的类名，而不是传统的类名语法。
   *    * 如果启用了 attributify，你可以使用如下语法：
   *      ```html
   *        <div text="red-500" bg="blue-500">Hello, World!</div>
   *      ```
   *    * attributify: false 表示禁用这种属性化的语法，恢复到常规的类名语法。你将只能使用传统的 class="text-red-500 bg-blue-500" 形式的类。
   */
  presets: [presetUno({ dark: 'class', attributify: false })],
  // transformers: [transformerVariantGroup()],
  // 定义快捷类，用于将多个常用类合并为一个短类
  shortcuts: {
    'wh-full': 'w-full h-full'
  }
})
