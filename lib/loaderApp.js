'use strict';

const consoln = require('consoln');
const Lloader = require('lloader');

/**
 * 加载指定配置选项的应用
 * @param {Array} paths 应用path数组
 */
module.exports = function loader(...paths) {

  const createApp = require('./createApp.js');

  const { apps } = this;

  // 截取第一个path作为主节点
  const mainPath = paths.shift();

  if (mainPath === undefined) {
    throw consoln.error(`ioa.app()参数不允许为空`);
  }

  createApp(mainPath, null, app => {
    this.main = app;
    apps[app.$name] = app;
  });

  for (const pathName of paths) {
    if (pathName) {
      createApp(pathName, null, app => {
        apps[app.$name] = app;
      });
    }
  }

  Lloader.loadAll(this.loaders, function (group) {

    console.log('\n\x1b[32m******************************** ioa loader **********************\n');

    // 显示加载顺序
    for (const level in group) {

      console.log(`\x1b[32m${level} -------------------------------------------------------------`);

      const filter = [];
      const list = group[level];

      for (const item of list) {

        const { error, nodePath } = item;

        if (error === undefined) {
          console.log(`\x1b[32m›  ${nodePath}`);
          filter.push(item);
        } else {
          console.log(`\x1b[33m×  ${nodePath}`);
        }

      }

      group[level] = filter;

    }

    console.log(`\n\x1b[32m*******************************************************************\x1b[30m\n`);

  });

}
