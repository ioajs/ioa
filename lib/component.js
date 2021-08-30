import path from 'path';
import consoln from 'consoln';
import mixin from './mixin.js';
import { components, paths, loaders, onames } from './common.js';

const cwd = process.cwd();
const pathRegExp = /\/([^/]+)\/?$/;

/**
 * 创建新组件或导出缓存组件
 * @param {string} oname 原始组件名或路径
 * @param {object} subscribe 订阅者
 * @returns {object} 组件实例
 */
export default function Component(oname, subscribe) {

  let component = onames[oname];

  if (component) {

    // 建立父子级双向关联，根节点除外
    if (subscribe) {
      component.$release[subscribe.$name] = subscribe;
      subscribe.$subscribe[component.$name] = component;
    }

    return component;

  }

  let $path, $name;

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

  // 包模块路径，从lib目录载入
  else {
    $path = path.join(cwd, 'node_modules', oname, 'lib');
    $name = oname;
  }

  component = {
    $name,
    $path,
    $release: {}, // 发布容器
    $subscribe: {}, // 订阅容器
    $emitData: {}, // 缓存发送的数据
    loads: {}, // 加载器配置项
    /**
     * 安装组件
     * @param {string} name 组件名称 
     */
    component(name) {

      if (name === undefined) return;

      const useComponent = Component(name, component);
      const error = mixin(component, useComponent.$emitData);

      if (error) {
        const newError = new Error(`${useComponent.$name}组件与${$name}订阅组件之间存在属性合并冲突，$${error}`);
        throw consoln.error(newError);
      }

      return useComponent;

    },
    /**
     * 导入依赖
     * @param {Object} options 
     */
    import(options) {

      component.loaderOptions = options;

    },
    /**
     * 导出依赖
     * @param {Object} options 
     */
    export(options) {

      for (const key in options) {
        const value = options[key];
        const { $release } = component;

        for (const name in $release) {

          const release = $release[name];
          const error = mixin(release, { [key]: value });

          if (error) {
            const newError = new Error(`${name}组件与${component.$name}子组件之间存在属性合并冲突，$${error}`);
            throw consoln.error(newError);
          }

        }

        // 缓存所有已发送的数据，让后注册的订阅器也能获取到之前发送的数据
        component.$emitData[key] = value;
      }

    }
  };

  paths[$path] = component;
  onames[oname] = component;
  components[$name] = component;

  if (subscribe) {
    component.$release[subscribe.$name] = subscribe;
    subscribe.$subscribe[$name] = component;
  }

  component.$indexPath = path.join($path, 'index.js');

  loaders.push(component);

  return component;

}