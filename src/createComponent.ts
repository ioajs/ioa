import path from 'path';
import { readFileSync } from 'fs';
import consoln from 'consoln';
import mixin from './mixin.js';
import { components, paths, loaders, onames } from './common.js';
import type { Component, PartialComponent, ImportOptions, ExportOptions } from './common.js';

const cwd = process.cwd();
const cwdSplit = cwd.split('/');
const pathRegExp = /\/([^/]+)\/?$/;

/**
 * 创建组件实例或导出已缓存的组件（不加载模块，仅创建空实例，建立依赖关系）
 * @param oname npm 模块组件名或原始路径
 * @param subscribe 订阅者
 * @returns 组件实例
 */
export default function createComponent(oname: string, subscribe: PartialComponent): Component {

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

  // npm 组件路径，沿 cwd 路径向上就近查找 package.json 文件
  else {

    const { length } = cwdSplit;
    for (let index = length; index >= 0; index--) {
      const basePath: string = path.join(cwdSplit.slice(0, index).join('/'), 'node_modules', oname);
      const packagePath = path.join(basePath, 'package.json');
      try {
        const packageString: string = readFileSync(packagePath, { encoding: 'utf8' });
        const packageObject = JSON.parse(packageString);
        $entry = path.join(basePath, packageObject.main || "lib/index.js");
        $base = path.join($entry, '..');
        $name = oname;
        break;
      } catch (e) { }
    }

    if ($entry === undefined) {
      throw consoln.error(new Error(`找不到 npm 模块 "${oname}"`));
    }

  }

  const component: Component = {
    $name,
    $base,
    $entry,
    $init: false,
    $import: {}, // 加载器配置项
    $components: {}, // 依赖组件集合
    $release: { [subscribe.$name]: subscribe }, // 被依赖组件集合
    $export: {}, // 导出的数据缓存
    component(name: string) {

      if (typeof name !== 'string') return;

      const dependencyComponent = createComponent(name, component);
      const error = mixin(component, dependencyComponent.$export);

      if (error) {
        const mixinError = new Error(`${$name} 组件与 ${dependencyComponent.$name} 组件之间存在关联属性合并冲突，${$name}${error}`);
        throw consoln.error(mixinError);
      }

      return dependencyComponent;

    },
    import(options: ImportOptions) {

      const error = mixin(component.$import, options);

      if (error) {
        const mixinError = new Error(`${$name} 组件 import(options) 中存在关联属性合并冲突，${$name}${error}`);
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
            const mixinError = new Error(`${name} 组件与 ${$name} 组件之间存在关联属性合并冲突，${name}${error}`);
            throw consoln.error(mixinError);
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
