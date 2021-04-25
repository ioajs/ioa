import consoln from 'consoln';
import loader from './loader.js';

//  递归装载入口文件
async function recursion(apps) {

  // 过滤已加载组件
  const imports = {};

  for (const name in apps) {
    const app = apps[name];
    if (!app.isLoad) {
      imports[name] = app;
    }
  }

  if (Object.keys(imports).length === 0) return;

  for (const name in imports) {

    const app = imports[name];

    await import(app.$indexPath).catch(e => {
      throw consoln.error(`“${app.$name}”组件入口index.js文件加载失败, ${app.$path}`);
    });

    app.isLoad = true;

  }

  for (const name in imports) {

    const app = imports[name];

    const { $subscribe } = app;

    await recursion($subscribe);

    // loads参数合并
    if (app.loadsMix) {
      Object.assign(app.loads, app.loadsMix);
    }

  }

}

/**
 * 加载一个或多个应用
 * @param {Array} paths 应用路径
 */
export default async function (...paths) {

  const { default: Component } = await import('./component.js');

  const { apps } = this;

  // 截取第一个path作为主节点
  const firstPath = paths.shift();

  if (firstPath === undefined) {
    throw consoln.error(`ioa.app()参数不允许为空`);
  }

  const main = Component(firstPath, null);

  this.main = main;
  apps[main.$name] = main;

  for (const path of paths) {
    if (path) {
      const app = Component(path, null);
      apps[app.$name] = app;
    }
  }

  await recursion(apps);

  const levels = {};

  for (const node of this.loaders) {
    loader.level(node, levels);
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
