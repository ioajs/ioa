export interface ImportOptions {
  [name: string]: {
    level: number
    action(v: unknown): unknown
  }
}

export interface ExportOptions {
  [name: string]: unknown
}

/** 组件实例*/
export interface Component {
  /**组件名称 */
  $name: string,
  /**组件根路径 */
  $base: string,
  /**组件入口文件路径 */
  $entry: string,
  /** 初始化锁定，防止重复加载 */
  $init: boolean
  /** 加载器配置项 */
  $import: { [name: string]: Component }
  /** 缓存导出的资源 */
  $export: { [name: string]: unknown }
  /** 订阅容器 */
  $components: { [name: string]: Component }
  /**发布容器 */
  $release: { [name: string]: PartialComponent }
  /** 依赖的组件 */
  component(name: string): Component
  /** 导入资源（模块） */
  import(options: ImportOptions): void
  /** 导出资源（对象） */
  export(options: ExportOptions): void
}

/** 应用实例 */
export interface PartialComponent extends Partial<Component> { }

export interface Components { [n: string]: Component }

export const loaders: PartialComponent[] = [];

export const onames: PartialComponent = {}; // 原始 name、path 映射实例

export interface Paths { [name: string]: PartialComponent }

export const paths: Paths = {}; // path 映射实例，用于 ioa.app() 中的错误路径匹配

/** 所有组件实例集合*/
export const components: Components = {};

export interface Apps {
  [name: string]: PartialComponent
}

/** 所有应用实例集合*/
export const apps: Apps = {
  /** 主应用实例 */
  main: {}
};
