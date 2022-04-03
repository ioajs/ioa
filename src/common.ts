export interface ImportOptions {
  [name: string]: {
    level: number
    action(v: any): any
  }
}

export interface ExportOptions {
  [name: string]: any
}

/** 组件实例*/
export interface Component {
  /**组件名称 */
  $name: string,
  /**组件目录路径 */
  $path: string,
  /** 初始化锁定，防止重复加载 */
  $init?: boolean
  /** 加载器配置项 */
  $import: { [name: string]: Component }
  /** 导入模块选项 */
  $import?: ImportOptions
  /** 缓存导出的资源 */
  $export: { [name: string]: any }
  /** 订阅容器 */
  $components: { [name: string]: Component }
  /**发布容器 */
  $release: { [name: string]: Component }
  /** 依赖的组件 */
  component(name: string): Component
  /** 导入资源（模块） */
  import(options: ImportOptions): void
  /** 导出资源（对象） */
  export(options: ExportOptions): void
}

export interface Components { [n: string]: Component }

export const loaders = [];
export const paths = {};
export const onames = {};

/** 所有组的集合*/
export const components = {};

/** 所有应用组的集合*/
export const apps = {};
