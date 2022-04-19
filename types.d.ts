// interface ImportOptions {
//   [name: string]: {
//     /**
//      * 加载项等级
//      */
//     level: number
//     /**
//      * 纯函数加载，不需要关联目录和文件的虚拟加载点
//      */
//     action?(): any
//     /**
//      * 模块加载完毕的回调函数，this 指向当前层级容器。如果无数据返回，则该模块输出为空。
//      * @param data 
//      * @param name 
//      */
//     module?(data: any, name: string): any
//     /**
//      * 目录加载完毕的回调函数，支持子集继承。如果无数据返回，则该目录结构不会被创建。
//      * @param data 
//      * @param name 
//      */
//     directory?(data: object, name: string): any
//     /**
//      * 目录加载完毕的回调函数，支持子集继承。如果无数据返回，则该目录结构不会被创建。
//      * @param options 
//      */
//     before?(options: object): any
//     /**
//      * 当前等级下所有目录、模块在加载后执行的钩子函数（仅在当前层级触发，不对子集继承），参数与 before(options)一致
//      * @param options 
//      */
//     after?(options: object): any
//   }
// }

// interface ExportOptions {
//   [name: string]: any
// }

// interface Ctx {
//   /** 请求路径 */
//   path: string
//   /** 请求类型 */
//   method: string
//   /** 请求路由参数 */
//   params: object,
//   /** koa request */
//   request: {
//     /** 请求头 */
//     header: object
//     /** 请求主体 */
//     body: any
//   }
//   /** 响应主体 */
//   body: any
// }

// interface Middleware {
//   /** 中间件 */
//   (ctx?: Ctx, next?: Function): any
// }

// /** 路由 */
// interface Router {
//   /**
//    * 注册全局路由中间件
//    */
//   global(middleware: Middleware): void
//   /**
//    * 注册应用级路由中间件
//    */
//   before(middleware: Middleware): void
//   /**
//    * 注册get请求路由
//    */
//   get(name: string, ...middlewares: [string | Middleware]): void
//   /**
//    * 注册post请求路由
//    */
//   post(name: string, ...middlewares: [string | Middleware]): void
//   /**
//    * 注册put请求路由
//    */
//   put(name: string, ...middlewares: [string | Middleware]): void
//   /**
//    * 注册delete请求路由
//    */
//   delete(name: string, ...middlewares: [string | Middleware]): void
//   /**
//    * 注册rest请求路由
//    */
//   resources(name: string, ...middlewares: [string | Middleware]): void
// }

// interface App {

//   /** 组件名称 */
//   $name: string

//   /** 组件所在路径 */
//   $path: string

//   /** 发布容器 */
//   $release: object

//   /** 订阅容器 */
//   $subscribe: object

//   /** 缓存发送的数据 */
//   $emitData: object

//   /** 加载器配置项 */
//   $loads: object

//   /** 组件集合 */
//   components: object;

//   /** 
//    * 注册组件，支持npm组件、相对路径和绝对路径组件
//    * @param {string} path 组件名称或路径 
//    */
//   component(path: string): any;

//   /**
//  * 目录、模块分级加载规则配置
//  * @param { object } options 
//  */
//   import(options: ImportOptions): void

//   /**
//   * 向订阅组件发送资源
//   */
//   export(options: ExportOptions): void

//   router?: Router

//   /** 中间件集合 */
//   middleware?: { [name: string]: Middleware }

// }

// declare module 'ioa' {
//   /**
//    * 加载一个或多个应用
//    * @param {string} path 要加载的应用路径
//    */
//   export function createApp(...path: Array<string>): void

//   /**
//    * 动态获取当前应用实例
//    * @param name 应用名
//    */
//   export function app(name?: string): App

//   /**
//    * 命令行参数
//    */
//   export const argv: {
//     default: [string],
//     [name: string]: [string]
//   }

//   /** 环境变量 */
//   export const NODE_ENV: string

//   /** 组件集合 */
//   export const components: { [name: string]: App }

//   /** 应用集合 */
//   export const apps: { [name: string]: App }

//   /** 主应用实例 */
//   export const main: App

// }
