import { accessSync } from 'fs';
import path from 'path';
import consoln from 'consoln';
import mixin from './mixin.js';
import { components, apps, paths, loaders, onames } from './common.js';
import type { PartialComponent, Component, ImportOptions, ExportOptions } from './common.js';

const cwd = process.cwd();
const pathRegExp = /\/([^/]+)\/?$/;

/**
 * 创建根应用组件实例（仅创建空实例，建立依赖关系,不加载模块）
 * @param { string } $name: 应用名称
 * @param { string } apppath 应用路径
 * @param { object } app 应用容器
 */
export function createRootComponent($name: string, apppath: string, app: PartialComponent) {

  let $base: string, $entry: string;


  const [point] = apppath[0];

  // 相对路径
  if (point === '.') {
    $base = path.join(cwd, apppath);
    $entry = path.join(cwd, apppath, 'index.js');
  }

  else {
    throw consoln.error(`无效的应用路径"${apppath}"`);
  }

  Object.assign(app, {
    $name,
    $base,
    $entry,
    $import: {}, // 加载器配置项
    $components: {}, // 关联组件依赖集合
    component(name: string) {
      if (typeof name !== 'string') return;

      const dependencyComponent = createComponent(name, app);
      const error = mixin(app, dependencyComponent.$export);

      if (error) {
        const mixinError = new Error(`"${$name}" 应用与 "${name}" 依赖组件导出对象之间存在属性合并冲突，${$name}${error}`);
        throw consoln.error(mixinError);
      }

      return dependencyComponent;
    },
    import(options: ImportOptions) {

      const error = mixin(app.$import, options);

      if (error) {
        const mixinError = new Error(`"${$name}" 应用 import 选项中存在属性合并冲突，${$name}${error}`);
        throw consoln.error(mixinError);
      }

    }
  })

  apps[$name] = app;
  paths[$base] = app;
  onames[apppath] = app;

  loaders.push(app);

}

const cwdSplit = cwd.split('/');

/**
 * 创建组件实例或导出已缓存的组件（不加载模块，仅创建空实例，建立依赖关系）
 * @param { string } oname npm 模块组件名或原始路径
 * @param { object } subscribe 订阅者
 * @returns { object } 组件实例
 */
export function createComponent(oname: string, subscribe: PartialComponent): Component {

  const cacheComponent: Component = onames[oname];

  if (cacheComponent) {

    cacheComponent.$release[subscribe.$name] = subscribe;
    subscribe.$components[cacheComponent.$name] = cacheComponent;

    return cacheComponent;

  }

  let $base: string, $entry: string, $name: string;

  const [first] = oname[0];

  // 相对路径
  if (first === '.') {
    $base = path.join(cwd, oname);
    $entry = path.join($base, 'index.js');
    const [, name] = oname.match(pathRegExp);
    $name = name;
  }

  // 绝对路径
  else if (first === '/') {
    $base = path.join(oname);
    $entry = path.join($base, 'index.js');
    const [name] = oname.match(pathRegExp);
    $name = name;
  }

  // npm 组件路径，沿 cwd 路径向上就近查找，约定从 lib 目录载入
  else {

    let { length } = cwdSplit;
    let state, basePath: string;
    for (let index = length; index >= 0; index--) {
      basePath = cwdSplit.slice(0, index).join('/');
      try {
        accessSync(path.join(basePath, 'node_modules', oname, 'package.json'));
        state = true;
        break;
      } catch (e) { }
    }

    if (state) {
      $base = path.join(basePath, 'node_modules', oname, 'lib');
      $entry = path.join($base, 'index.js');
      $name = oname;
    } else {
      throw consoln.error(new Error(`找不到 npm 模块 "${oname}"`));
    }

  }

  const component: Component = {
    $name,
    $base,
    $entry,
    $import: {}, // 加载器配置项
    $components: {}, // 依赖组件集合
    $release: { [subscribe.$name]: subscribe }, // 被依赖组件集合
    $export: {}, // 导出的数据缓存
    $init: false,
    component(name: string) {

      if (typeof name !== 'string') return;

      const dependencyComponent = createComponent(name, component);
      const error = mixin(component, dependencyComponent.$export);

      if (error) {
        const mixinError = new Error(`"${$name}" 组件与 "${dependencyComponent.$name}" 依赖组件导出对象之间存在属性合并冲突，${$name}${error}`);
        throw consoln.error(mixinError);
      }

      return dependencyComponent;

    },
    import(options: ImportOptions) {

      const error = mixin(component.$import, options);

      if (error) {
        const mixinError = new Error(`"${$name}" 组件 import(options) 中存在属性合并冲突，${$name}${error}`);
        throw consoln.error(mixinError);
      }

    },
    export(options: ExportOptions) {

      const { $release, $export } = component;

      for (const key in options) {
        const value = options[key];

        for (const name in $release) {

          const release = $release[name];
          const error = mixin(release, { [key]: value });

          if (error) {
            const newError = new Error(`"${name}" 组件与 "${$name}" 依赖组件之间存在属性合并冲突，${name}${error}`);
            throw consoln.error(newError);
          }

        }

        // 缓存所有已发送的数据，让后注册的订阅器也能获取到之前发送的数据
        $export[key] = value;
      }

    }
  };

  paths[$base] = component;
  onames[oname] = component;
  components[$name] = component;
  subscribe.$components[$name] = component;

  loaders.push(component);

  return component;

}
