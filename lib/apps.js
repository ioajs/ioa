import consoln from 'consoln';
import loader from './loader.js';
import Component from './component.js';
import { ioa, applications, loaders } from './common.js';

//  递归装载入口文件
async function recursionIndex(components) {

  const imports = {}; // 待加载组件

  for (const name in components) {
    const component = components[name];
    if (!component.isInit) {
      imports[name] = component;
    }
  }

  if (Object.keys(imports).length === 0) return;

  for (const name in imports) {

    const component = imports[name];

    const { default: options } = await import(component.$indexPath).catch(() => {
      throw consoln.error(`“${component.$name}”组件入口index.js文件加载失败, ${component.$path}`);
    });

    if (options) {

      if (options.components) {
        for (const name of options.components) {
          component.component(name);
        }
      }

      if (options.import) {
        component.import(options.import);
      }

      if (options.export) {
        const _export = options.export;
        for (const name in _export) {
          component.export(name, _export[name]);
        }
      }

    }

    component.isInit = true;

  }

  for (const name in imports) {

    const component = imports[name];

    const { $subscribe } = component;

    await recursionIndex($subscribe);

    // loads参数合并
    if (component.loaderOptions) {
      Object.assign(component.loads, component.loaderOptions);
    }

  }

}

/**
 * 加载一个或多个应用
 * @param {Array} paths 应用路径
 */
export default async function (...paths) {

  // 截取第一个path作为主节点
  const mainPath = paths.shift();

  if (mainPath === undefined) {
    throw consoln.error(`ioa.apps()参数不允许为空`);
  }

  const main = Component(mainPath, null);

  ioa.main = main;
  applications[main.$name] = main;

  for (const path of paths) {
    if (path) {
      const app = Component(path, null);
      applications[app.$name] = app;
    }
  }

  await recursionIndex(applications);

  const levels = {};

  for (const component of loaders) {
    loader.level({
      dirpath: component.$path,
      root: component,
      data: component,
      loads: component.loads
    }, levels);
  }

  console.log('\n\x1b[32m******************************** ioa loader **********************\n');

  // 显示加载时序
  for (const level in levels) {

    console.log(`\x1b[32m${level} -------------------------------------------------------------`);

    const filter = [];
    const queue = levels[level];

    for (const item of queue) {

      if (item.error === undefined) {
        filter.push(item);
        if (item.action) {
          console.log(`\x1b[35m*  ${item.path}/index.js ${item.name}()`);
        } else if (item.isModule) {
          console.log(`\x1b[36m›  ${item.path}`);
        } else {
          console.log(`\x1b[34m#  ${item.path} [${item.children.length}]`);
        }
      } else {
        console.log(`\x1b[33m!  ${item.path}`);
      }

    }

    levels[level] = filter;

  }

  console.log(`\n\x1b[32m*******************************************************************\x1b[30m\n`);


  await loader.load(levels);

}
