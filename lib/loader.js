'use strict';

const path = require('path');
const T = require('ttools');
const fs = require('fs-extra');
const Lloader = require('lloader');
const root = require('..');
const options = require('./options');

root.options = options;

const { apps, cwd, version } = root;

const ioConfig = {
   "./main": {
      "enable": true
   }
};

try {
   const appConfig = require(path.join(cwd, 'app.config'));
   Object.assign(ioConfig, appConfig);
} catch (error) {

}

// 预构建app容器
T(ioConfig).query({ '*.enable': true }, (pathName, item) => {

   let { name, options } = item;

   const app = { ...root };

   // 未指定name时从pathName中提取
   if (!name) {
      name = pathName.match(/\w+$/)[0];
   }

   app.name = name;

   apps[name] = app;

   const relativePath = pathName.match(/^\./);

   // 相对路径
   if (relativePath) {
      app.path = path.join(cwd, pathName);
   }

   // 绝对路径
   else if (path.isAbsolute(pathName)) {
      app.path = path.join(pathName, 'app');
   }

   // 模块路径
   else {
      app.path = path.join(cwd, 'node_modules', pathName, 'app');
   }

   app.scopePath = path.join(app.path, 'node_modules', '@app');

   // 扩展.loader.js中的加载配置项
   if (options) {
      try {
         const value = require(path.join(app.path, '.options.js'))
         options(root, value);
      } catch (error) {
         throw error;
      }
   }

});

root.main = apps.main;

const loaders = [];

for (const name in apps) {

   const app = apps[name];

   // 临时读取模块作用域ioa容器
   root.scope = app;

   // 模块作用域ioa依赖注入、版本对比、版本同步
   try {
      const pack = require(path.join(app.scopePath, 'package.json'))
      if (pack.version !== version) {
         throw null;
      }
   } catch (error) {
      fs.outputFileSync(path.join(app.scopePath, 'package.json'),
         `{"version": "${version}","main": "index.js"}`
      );
      fs.outputFileSync(path.join(app.scopePath, 'index.js'),
         `'use strict';const path = require('path');const ioa = require(path.join(process.cwd(), 'node_modules', 'ioa'));module.exports = ioa.scope;`
      );
   }

   // 加载、固化组件作用域内的app模块
   require(app.scopePath);

   const loader = new Lloader(app.path);

   loader.save(app);

   loaders.push(loader);

}

Lloader.loadAll(loaders, function (group) {

   console.log('');

   // 显示加载顺序
   for (const name in group) {
      const list = group[name];
      console.log(`\x1b[32m------------------------------ loader \x1b[33m${name}\x1b[32m ------------------------------\x1b[30m`);
      for (const item of list) {
         const { container, name, path } = item;
         console.log(` \x1b[33mapps.${container.name}.${name} \x1b[35m${path}\x1b[30m`);
      }
   }

   console.log('');

});