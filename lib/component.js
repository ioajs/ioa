import path from 'path';
import consoln from 'consoln';
import mixin from './mixin.js';
import ioa from '../index.js';

const { cwd, loaders, components, paths } = ioa;

const pathRegExp = /\/([^\/]+)\/?$/;

/**
 * 创建新组件或导出缓存组件
 * @param {string} cpath app路径
 * @param {object} subscribe 订阅者
 * @returns {object} 组件实例
 */
export default function Component(cpath, subscribe) {

  let $path, $name;

  const [point] = cpath[0];

  // 相对路径
  if (point === '.') {
    $path = path.join(cwd, cpath);
    const [, name] = cpath.match(pathRegExp);
    $name = name;
  }

  // 绝对路径
  else if (path.isAbsolute(cpath)) {
    $path = path.join(cpath);
    const [name] = cpath.match(pathRegExp);
    $name = name;
  }

  // 模块路径，从lib目录载入
  else {
    $path = path.join(cwd, 'node_modules', cpath, 'lib');
    $name = cpath;
  }

  let component = components[$name];

  // 首次使用
  if (component === undefined) {

    component = {
      $name,
      $path,
      $release: {}, // 发布容器
      $subscribe: {}, // 订阅容器
      $emitData: {}, // 缓存发送的数据
      loads: {}, // 加载器配置项
      components,
      /**
       * 订阅器，用于接收依赖
       * @param {string} name 组件名称 
       */
      use(name) {

        if (!name) return;

        return Component(name, component);

      },
      /**
       * 向订阅器发送依赖
       * @param {string} key 
       * @param {*} value 
       */
      emit(key, value) {

        const { $release } = component;
        const data = { [key]: value };

        for (const name in $release) {

          const release = $release[name];
          const error = mixin(release, data);

          if (error) {
            const newError = new Error(`${name}组件与${component.$name}子组件之间存在属性合并冲突，$${error}`);
            throw consoln.error(newError);
          }

        }

        // 缓存所有已发送的数据，让后注册的订阅器也能获取到之前发送的数据
        component.$emitData[key] = value;

      },
      /**
       * 设置加载项
       * @param {Object} options 
       */
      loader(options) {

        component.loadsMix = options;

      }
    };

    paths[$path] = component;
    components[$name] = component;

    if (subscribe) {
      component.$release[subscribe.$name] = subscribe;
      subscribe.$subscribe[$name] = component;
    }

    component.indexPath = path.join($path, 'index.js');

    loaders.push({
      dirpath: $path,
      root: component,
      data: component,
      loads: component.loads
    });

  }

  // 重复使用
  else {

    // 建立父子级双向关联，根节点除外
    if (subscribe) {
      component.$release[subscribe.$name] = subscribe;
      subscribe.$subscribe[$name] = component;
    }

  }

  return component;

}