declare module 'ioa' {

  /**
   * 加载一个或多个应用
   * @param {string} path 要加载的应用路径
   */
  export function app(...path: Array<string>): void

  /** 命令行参数 */
  export const argv: object

  /** 环境变量 */
  export const NODE_ENV: string

  /** 主应用 */
  export const main: {
    components: object
  }

  /** 应用集合 */
  export const apps: Object

  /** 组件集合 */
  export const components: object

}


declare module '@app' {

  /** 组件名称 */
  export const $name: string

  /** 组件所在路径 */
  export const $path: string

  /** 发布容器 */
  export const $release: object

  /** 加载器配置项 */
  export const loads: object

  /** 订阅容器 */
  export const $subscribe: object

  /** 缓存发送的数据 */
  export const $emitData: object

  /** 组件集合 */
  export const components: object;

  /** 
   * 安装组件，支持npm组件、相对路径和绝对路径组件
   * @param {string} path 组件名称或路径 
   */
  export function use(path: string): void

  /**
   * 向订阅组件发送资源
   */
  export function emit(key: string, value: any): void

  /**
 * 模块、目录分级加载规则配置
 * @param {Object} options 
 */
  export function loader(options: object): void

}