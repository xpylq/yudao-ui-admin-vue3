// 这一行指令告诉 TypeScript 引入 Vite 客户端的类型声明文件，以便在项目中使用 Vite 提供的特性时获得类型支持
/// <reference types="vite/client" />

// 声明了对 *.vue 文件的支持，让 TypeScript 知道如何处理 .vue 文件。
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  /**
   * DefineComponent 是 Vue 3 中的一个类型，用于定义 Vue 组件
   * 第一个空对象 {} 表示该组件没有定义 props（属性）。
   * 第二个空对象 {} 表示该组件没有定义 data（数据）或 computed（计算属性）。
   * any 表示组件实例的类型，这里使用 any，即任何类型，你可以根据实际需求将其替换为更具体的类型（如：InstanceType<typeof MyComponent>）。
   */
  const component: DefineComponent<{}, {}, any>
  // 导出该组件
  export default component
}

/**
 * 这部分定义了一个 ImportMetaEnv 接口，它描述了 Vite 项目中的环境变量。
 * 每个环境变量都被声明为 readonly，意味着这些值是只读的，不能在运行时修改。
 * 这些变量通常会在 .env 文件中配置，或者在 Vite 配置中设置。通过 import.meta.env 可以访问这些环境变量。
 * 比如，你可以通过 import.meta.env.VITE_APP_TITLE 来获取应用的标题。
 */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: number
  readonly VITE_OPEN: string
  readonly VITE_DEV: string
  readonly VITE_APP_CAPTCHA_ENABLE: string
  readonly VITE_APP_TENANT_ENABLE: string
  readonly VITE_APP_DEFAULT_LOGIN_TENANT: string
  readonly VITE_APP_DEFAULT_LOGIN_USERNAME: string
  readonly VITE_APP_DEFAULT_LOGIN_PASSWORD: string
  readonly VITE_APP_DOCALERT_ENABLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string
  readonly VITE_BASE_PATH: string
  readonly VITE_DROP_DEBUGGER: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_SOURCEMAP: string
  readonly VITE_OUT_DIR: string
}

/**
 * 这部分代码扩展了全局的 ImportMeta 接口，告诉 TypeScript import.meta 对象下的 env 属性是一个 ImportMetaEnv 类型。
 * 这样，当你在代码中访问 import.meta.env 时，TypeScript 会知道它包含哪些环境变量，并进行类型检查。
 */
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
