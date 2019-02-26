'use strict';

const fs = require('fs');
const path = require('path');
const root = require('..');
const { apps, cwd, AppsMiddleware } = root

// rest路由参数格式约定
const Resources = {
   "index": {
      "type": 'GET',
      "params": ""
   },
   "details": {
      "type": 'GET',
      "params": "/:id"
   },
   "create": {
      "type": 'POST',
      "params": ""
   },
   "update": {
      "type": 'PUT',
      "params": "/:id"
   },
   "destroy": {
      "type": 'DELETE',
      "params": "/:id"
   }
}

// 路由预处理解析容器
const container = {}

root.container = container


/**
 * 为app添加路由依赖
 * @param {*} app 
 */
function router(app) {

   /**
    * 
    * @param {String} type 请求类型，GET、POST、PUT、DELETE
    * @param {String} path 路由路径
    * @param {Array} middleware 包含多个中间件的数组
    * @param {Function} controller 控制器
    */
   function processPath(type, path, middleware, controller) {

      // 中间件类型验证
      for (let item of middleware) {
         if (item) {
            if (!(item instanceof Function)) {
               throw new Error(`路由指定中间件必须为函数类型`)
            }
         } else {
            throw new Error(`路由指定中间件不存在`)
         }
      }

      // 控制器类型验证
      if (!(controller instanceof Function)) {
         throw new Error(`路由指定${path}控制器不存在`)
      }

      let [, ...pathArray] = path.split('/')

      // 对请求类型进行分组保存
      let iterative = container

      //将path路径转换为对应的对象索引结构
      for (let name of pathArray) {

         let [one, ...cname] = name

         // 路由包含动态参数，提取并保存参数名
         if (one === ':') {

            if (!iterative["<*>"]) {
               iterative["<*>"] = {}
            }

            iterative = iterative["<*>"]
            iterative["<name>"] = cname.join('')

         } else {

            if (!iterative[name]) {
               iterative[name] = {}
            }
            
            iterative = iterative[name]

         }

      }

      if (!iterative['<middleware>']) {
         iterative['<middleware>'] = {}
      }

      iterative['<middleware>'][type] = [
         ...AppsMiddleware,
         ...app.AppMiddleware,
         ...middleware,
         controller
      ]

   }

   /**
    * 从middleware中根据Path路径提取控制器
    * @param {*} middleware 
    */
   function processController(path, middleware) {

      let controller = middleware.pop()

      if (typeof controller === 'string') {

         const controllerPath = controller

         const controllerPathArray = controllerPath.split('.')
         controller = app.controller

         // 迭代提取controller
         for (let itemPath of controllerPathArray) {

            let item = controller[itemPath]
            if (item) {
               controller = item
            } else {
               throw new Error(`${path}路由中未找到${controllerPath}控制器`)
            }

         }

         if (controller instanceof Function) {

            return controller

         } else {

            throw new Error(`${path}路由中指定${controllerPath}控制器必须为函数类型`)

         }

      } else if (controller instanceof Function) {

         return controller

      } else {

         throw new Error(`${path}路由中指定控制器必须为函数类型`)

      }

   }

   // 路由预处理解析，按请求类型进行分组
   const router = {
      get(path, ...middleware) {
         const controller = processController(path, middleware)
         processPath('GET', path, middleware, controller)
      },
      post(path, ...middleware) {
         const controller = processController(path, middleware)
         processPath('POST', path, middleware, controller)
      },
      put(path, ...middleware) {
         const controller = processController(path, middleware)
         processPath('PUT', path, middleware, controller)
      },
      delete(path, ...middleware) {
         const controller = processController(path, middleware)
         processPath('DELETE', path, middleware, controller)
      },
      /**
       * rest api
       * @param {String} path 
       * @param {...Function} middleware 
       */
      resources(path, ...middleware) {

         const controllerPath = middleware.pop()
         const controllerPathArray = controllerPath.split('.')

         // 迭代提取controller
         let controller = app.controller
         for (const name of controllerPathArray) {
            const item = controller[name]
            if (item) {
               controller = item
            } else {
               throw new Error(`RESTful路由指定${controllerPath}控制器不存在`)
            }
         }

         if (typeof controller === 'object') {

            for (const name in Resources) {
               const action = controller[name]
               if (action instanceof Function) {
                  const { type, params } = Resources[name]
                  processPath(type, path + params, middleware, action)
               }
            }

         } else {

            throw new Error(`REST路由指定${controllerPath}控制器不存在`)

         }

      }
   }

   app.router = router

}


// 加载组件路由配置文件
for (const name in apps) {

   const app = apps[name]

   const routerPath = path.join(cwd, app.path, 'router.js')

   try {
      fs.accessSync(routerPath);
   } catch (err) {
      continue
   }

   try {
      router(apps[name])
      require(routerPath)
   } catch (error) {
      throw error
   }

}