import path from 'path';
import consoln from 'consoln';
import mixin from './mixin.js';
import createComponent from './createComponent.js';
import { paths, loaders, onames } from './common.js';
import type { Component, ImportOptions } from './common.js';

export interface Main extends Omit<Component, '$init' | '$release' | 'export' | '$export'> {
  [name: string]: any
}

/** 主应用实例 */
const main: Main = {
  $name: "main",
  $base: '',
  $entry: '',
  $import: {}, // 加载器配置项
  $components: {}, // 关联组件依赖集合
  component(name: string) {
    if (typeof name !== 'string') return;

    const dependencyComponent = createComponent(name, main);
    const error = mixin(main, dependencyComponent.$export);

    if (error) {
      const mixinError = new Error(`main 应用与 "${name}" 依赖组件导出对象之间存在属性合并冲突，main${error}`);
      throw consoln.error(mixinError);
    }

    return dependencyComponent;
  },
  import(options: ImportOptions) {

    const error = mixin(main.$import, options);

    if (error) {
      const mixinError = new Error(`main 应用 import 选项中存在属性合并冲突，main${error}`);
      throw consoln.error(mixinError);
    }

  }
};

const cwd = process.cwd();

/**
 * 创建根应用组件实例（仅创建空实例，建立依赖关系,不加载模块）
 * @param appPath 应用路径
 */
export function createMain(appPath: string) {

  let $base: string, $entry: string;

  const [point] = appPath[0];

  // 相对路径
  if (point === '.') {
    $base = path.join(cwd, appPath);
    $entry = path.join(cwd, appPath, 'index.js');
  } else {
    throw consoln.error(`无效的应用路径"${appPath}"`);
  }

  main.$base = $base;
  main.$entry = $entry;

  paths[$base] = main;
  onames[appPath] = main;

  loaders.push(main);

}

export default main;