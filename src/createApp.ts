import path from 'path';
import consoln from 'consoln';
import loader from './loader.js';
import { createApp, createComponent } from './createComponent.js';
import { apps, loaders, type Components } from './common.js';
import ioa from './index.js';

/**
 * 使用深度优先策略，递归预装载所有组件的 index 入口文件
 */
async function recursionIndex(components: Components) {

  const imports = {}; // 待加载组件

  for (const name in components) {
    const component = components[name];
    if (!component.$init) {
      imports[name] = component;
    }
  }

  if (Object.keys(imports).length === 0) return;

  for (const name in imports) {

    const component = imports[name];

    const indexpath = path.join(component.$path, 'index.js');
    const { default: options } = await import(indexpath).catch(error => {
      consoln.error(`“${component.$name}”组件入口文件加载失败, "${indexpath}"`);
      throw consoln.error(error);
    });

    // 模块有返回值时，表示使用了声明式对象
    if (options) {

      if (options.component) {
        for (const name of options.component) {
          component.component(name);
        }
      }

      if (options.import) {
        component.import(options.import);
      }

      if (options.export) {
        component.export(options.export);
      }

    }

    component.$init = true;

  }

  for (const name in imports) {

    const component = imports[name];

    const { $components } = component;

    await recursionIndex($components);

  }

}


/**
 * 装载单个或多个应用
 * @param {string[]} paths 应用路径
 */
export default async function (...paths: string[]) {

  // 截取第一个path作为主节点
  const mainPath = paths.shift();

  if (mainPath === undefined) {
    throw consoln.error(`createApp 参数不允许为空`);
  }

  createApp(mainPath, ioa.main);

  for (const path of paths) {
    if (path) createApp(path, {});
  }

  await recursionIndex(apps);

  /////////////// 根据加载时序，预先对应用进行分级排序 ///////////////

  const levels = {};

  for (const component of loaders) {
    loader.level({
      dirpath: component.$path,
      root: component,
      data: component,
      imports: component.$import
    }, levels);
  }

  console.log('\n\x1b[32m******************************** ioa loader **********************\n');

  // 显示加载时序
  for (const level in levels) {

    console.log(`\x1b[32m${level}›--------------------------------------------------------`);

    const filter = [];
    const queue = levels[level];

    for (const item of queue) {

      if (item.error === undefined) {
        filter.push(item);
        if (item.isFile) {
          console.log(`\x1b[36m›  ${item.path}`);
        } else if (item.children) {
          console.log(`\x1b[34m#  ${item.path}/ [${item.children.length}]`);
        } else if (item.action) {
          console.log(`\x1b[35m*  ${item.path}/index.js ${item.name}()`);
        }
      } else {
        console.log(`\x1b[33m!  ${item.path}`);
      }

    }

    levels[level] = filter;

  }

  console.log(`\n\x1b[32m*******************************************************************\x1b[30m\n`);

  // 异步加载所有模块
  await loader.loading(levels);

}
