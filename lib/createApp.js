'use strict';

const ioa = require('..');
const fs = require('fs');
const path = require('path');
const consoln = require('consoln');
const Lloader = require('lloader');
const mixin = require('./mixin.js');

const { cwd, loaders, components: allComponents } = ioa;

const pathRegExp = /\/([^\/]+)\/?$/;

/**
 * 创建新组件或导出缓存app组件
 * @param {string} pathName app路径
 * @param {object} subscribe 订阅者
 * @param {function} appCallback app实例创建时的回调，用于提前获取createApp函数中创建的app对象
 * @returns {object} app实例
 */
module.exports = function createApp(pathName, subscribe, appCallback) {

  let $path, $name;

  const [point] = pathName[0];

  // 相对路径
  if (point === '.') {
    $path = path.join(cwd, pathName);
    const [, name] = pathName.match(pathRegExp);
    $name = name;
  }

  // 绝对路径
  else if (path.isAbsolute(pathName)) {
    $path = path.join(pathName);
    const [name] = pathName.match(pathRegExp);
    $name = name;
  }

  // 模块路径，从lib目录载入
  else {
    $path = path.join(pathName, 'lib');
    $name = pathName;
  }

  let app = allComponents[$name];

  // 首次引用
  if (app === undefined) {

    // 检查组件是否存在
    try {
      $path = path.dirname(require.resolve($path));
    } catch (error) {
      throw consoln.error(`未找到“${pathName}”组件, 请检查“${$path}”路径下是否存在入口文件`);
    }

    const scopePath = path.join($path, 'node_modules', '@app.js');

    // 模块作用域ioa依赖注入
    try {

      // 在动态加载未知模块前，先使用fs模块探测文件是否存在
      // 如果直接使用require会产生模块缓存bug，首次require找不到模块后，不管之后模块是否存在，重复调用时还是找不到该模块
      fs.accessSync(scopePath);

    } catch (error) {

      fs.mkdirSync(path.join($path, 'node_modules'), { recursive: true });
      fs.writeFileSync(scopePath, `module.exports = {};`);

    }

    app = require(scopePath); // 加载组件作用域内的@app模块

    const $subscribe = {};

    /**
     * 订阅器，用于接收依赖
     * @param {string} name 组件名称 
     */
    function use(name) {

      if (!name) {
        const newError = new Error(`${app.$name}组件中包含无效的未命名子组件，请检测app.on方法`);
        throw consoln.error(newError);
      }

      const newApp = createApp(name, app);

      const error = mixin(app, newApp.$emitData);

      if (error) {
        const newError = new Error(`${app.$name}组件与${newApp.$name}子组件之间存在属性合并冲突，app${error}`);
        throw consoln.error(newError);
      }

    }

    Object.assign(app, {
      $name,
      $path,
      $release: {}, // 发布容器
      $subscribe, // 订阅容器
      $emitData: {}, // 缓存发送的数据
      loads: {}, // 加载器配置项
      components: $subscribe, // 引用$subscribe
      use,
      on: use,
      /**
       * 向订阅器发送依赖
       * @param {string} key 
       * @param {*} value 
       */
      emit(key, value) {

        const { $release } = this;
        const data = { [key]: value };

        for (const name in $release) {

          const release = $release[name];
          const error = mixin(release, data);

          if (error) {
            const newError = new Error(`${name}组件与${this.$name}子组件之间存在属性合并冲突，$${error}`);
            throw consoln.error(newError);
          }

        }

        // 缓存所有已发送的数据，让后注册的订阅器也能获取到之前发送的数据
        this.$emitData[key] = value;

      },
      /**
       * 设置加载项
       * @param {Object} options 
       */
      loader(options) {

        Object.assign(this.loads, options);
        
      }
    })

    allComponents[$name] = app;

    if (subscribe) {
      app.$release[subscribe.$name] = subscribe;
      subscribe.$subscribe[$name] = app;
    }

    if (appCallback) appCallback(app); // app创建时的回调

    const { loads } = app;

    const loadPath = path.join($path, 'index.js');

    const options = require(loadPath); // 加载组件入口模块

    if (options) {
      Object.assign(loads, options);
    }

    const loader = new Lloader($path, app, loads);

    loaders.push(loader);

  }

  // 重复引用
  else {

    // 建立父子级双向关联，根节点除外
    if (subscribe) {
      app.$release[subscribe.$name] = subscribe;
      subscribe.$subscribe[$name] = app;
    }

  }

  return app;

}