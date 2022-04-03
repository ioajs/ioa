import path from 'path';
import consoln from 'consoln';
import mixin from './mixin.js';
import { components, apps, paths, loaders, onames } from './common.js';
import type { Component, ImportOptions, ExportOptions } from './common.js';

const cwd = process.cwd();
const pathRegExp = /\/([^/]+)\/?$/;

/**
 * 创建应用组件实例（不加载模块，仅创建空实例，建立依赖关系）
 * @param { string } oname 原始组件名或路径
 * @param { object } app 应用容器
 */
export function createApp(oname: string, app: Omit<Component, "export">) {

  let $path: string, $name: string;

  const [point] = oname[0];

  // 相对路径
  if (point === '.') {
    $path = path.join(cwd, oname);
    const [, name] = oname.match(pathRegExp);
    $name = name;
  }

  // 绝对路径
  else if (path.isAbsolute(oname)) {
    $path = path.join(oname);
    const [name] = oname.match(pathRegExp);
    $name = name;
  }

  else {
    throw consoln.error(`无效的应用路径"${oname}"`);
  }

  Object.assign(app, {
    $name,
    $path,
    $import: {}, // 加载器配置项
    $components: {}, // 关联组件依赖集合
    $export: {}, // 导出数据的缓存
    component(name: string) {
      if (typeof name !== 'string') return;

      const dependencyComponent = createComponent(name, app);
      const error = mixin(app, dependencyComponent.$export);

      if (error) {
        const mixinError = new Error(`${$name} 应用与 ${name} 依赖组件导出对象之间存在属性合并冲突，${error}`);
        throw consoln.error(mixinError);
      }

      return dependencyComponent;
    },
    import(options: ImportOptions) {

      const error = mixin(app.$import, options);

      if (error) {
        const mixinError = new Error(`${$name} 应用 import 选项中存在属性合并冲突，${error}`);
        throw consoln.error(mixinError);
      }

    }
  })

  paths[$path] = app;
  onames[oname] = app;
  components[$name] = app;
  apps[$name] = app;

  loaders.push(app);

}

/**
 * 创建组件实例或导出已缓存的组件（不加载模块，仅创建空实例，建立依赖关系）
 * @param { string } oname 原始组件名或路径
 * @param { object } subscribe 订阅者
 * @returns { object } 组件实例
 */
export function createComponent(oname: string, subscribe: Component): Component {

  const cacheComponent: Component = onames[oname];

  if (cacheComponent) {

    cacheComponent.$release[subscribe.$name] = subscribe;
    subscribe.$components[cacheComponent.$name] = cacheComponent;

    return cacheComponent;

  }

  let $path: string, $name: string;

  const [point] = oname[0];

  // 相对路径
  if (point === '.') {
    $path = path.join(cwd, oname);
    const [, name] = oname.match(pathRegExp);
    $name = name;
  }

  // 绝对路径
  else if (path.isAbsolute(oname)) {
    $path = path.join(oname);
    const [name] = oname.match(pathRegExp);
    $name = name;
  }

  // npm 组件路径，从lib目录载入
  else {
    $path = path.join(cwd, 'node_modules', oname, 'lib');
    $name = oname;
  }

  const component: Component = {
    $name,
    $path,
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
        const mixinError = new Error(`$${$name} 组件与 ${dependencyComponent.$name} 依赖组件导出对象之间存在属性合并冲突，${error}`);
        throw consoln.error(mixinError);
      }

      return dependencyComponent;

    },
    import(options: ImportOptions) {

      const error = mixin(component.$import, options);

      if (error) {
        const mixinError = new Error(`${$name} 组件 import(options) 中存在属性合并冲突，${error}`);
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
            const newError = new Error(`${name}组件与${$name}子组件之间存在属性合并冲突，$${error}`);
            throw consoln.error(newError);
          }

        }

        // 缓存所有已发送的数据，让后注册的订阅器也能获取到之前发送的数据
        $export[key] = value;
      }

    }
  };

  paths[$path] = component;
  onames[oname] = component;
  components[$name] = component;
  subscribe.$components[$name] = component;

  loaders.push(component);

  return component;

}


