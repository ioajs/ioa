'use strict';

const path = require('path');
const fs = require('fs-extra');
const Lloader = require('lloader');
const ioa = require('..');

const { loaders } = ioa;

/**
 * 生成组件作用域模块
 * @param {Array} app 组件队列
 */
function generate(app) {

   const { scopePath } = app;

   // 供模块作用域临时读取的对象容器
   ioa.scope = app;

   // 模块作用域ioa依赖注入
   try {

      // 在动态加载未知模块前，先使用fs模块探测文件是否存在
      // 如果直接使用require会产生模块缓存bug，首次require找不到模块后，不管之后模块是否存在，重复调用时还是找不到该模块
      fs.accessSync(scopePath);

   } catch (error) {

      fs.outputFileSync(scopePath,
         `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
      );

   }

   require(scopePath); // 加载、固化组件作用域内的@app模块

   const { loads } = app;

   const loadPath = path.join(app.$path, '.loader.js');

   const options = require(loadPath);
   
   Object.assign(loads, options);

   const loader = new Lloader(app.$path, app, loads);

   loaders.push(loader);

}

module.exports = generate;