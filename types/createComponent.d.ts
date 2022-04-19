import type { PartialComponent, Component } from './common.js';
/**
 * 创建根应用组件实例（仅创建空实例，建立依赖关系,不加载模块）
 * @param { string } $name: 应用名称
 * @param { string } apppath 应用路径
 * @param { object } app 应用容器
 */
export declare function createRootComponent($name: string, apppath: string, app: PartialComponent): void;
/**
 * 创建组件实例或导出已缓存的组件（不加载模块，仅创建空实例，建立依赖关系）
 * @param { string } oname npm 模块组件名或原始路径
 * @param { object } subscribe 订阅者
 * @returns { object } 组件实例
 */
export declare function createComponent(oname: string, subscribe: PartialComponent): Component;
