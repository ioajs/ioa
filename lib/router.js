'use strict';

const path = require('path')
const app = require('./app')
const { root, components } = app

// rest路由参数格式约定
const Resources = {
   "index": {
      "type": 'GET',
      "parameter": ""
   },
   "details": {
      "type": 'GET',
      "parameter": "/:id"
   },
   "create": {
      "type": 'POST',
      "parameter": ""
   },
   "update": {
      "type": 'PUT',
      "parameter": "/:id"
   },
   "destroy": {
      "type": 'DELETE',
      "parameter": "/:id"
   }
}

// 路由预处理解析容器
const container = {}

app.container = container


/**
 * 为app添加路由依赖
 * @param {*} app 
 */
function router(app) {

   /**
    * 
    * @param {String} type 请求类型，GET、POST、PUT、DELETE
    * @param {String} path 路由路径
    * @param {Array} middlewares 包含多个中间件的数组
    * @param {Function} controller 控制器
    */
   function processPath(type, path, middlewares, controller) {

      // 中间件类型验证
      for (let item of middlewares) {
         if (item) {
            if (!(item instanceof Function)) {
               throw new Error(`路由指定${name}中间件必须为函数类型`)
            }
         } else {
            throw new Error(`路由指定${name}中间件不存在`)
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

      if (!iterative['<middlewares>']) {
         iterative['<middlewares>'] = {}
      }

      iterative['<middlewares>'][type] = [...app.commonMiddlewares, ...middlewares, controller]

   }

   /**
    * 从middlewares中根据Path路径提取控制器
    * @param {*} middlewares 
    */
   function processController(middlewares) {

      const controllerPath = middlewares.pop()
      const controllerPathArray = controllerPath.split('.')
      let controller = app.controller

      // 迭代提取controller
      for (let itemPath of controllerPathArray) {
         let item = controller[itemPath]
         if (item) {
            controller = item
         } else {
            throw new Error(`路由指定${controllerPath}控制器不存在`)
         }
      }

      if (typeof controller === 'function') {
         return controller
      } else {
         throw new Error(`路由指定${controllerPath}控制器不存在`)
      }

   }


   // 路由预处理解析，按请求类型进行分组
   const router = {
      get(path, ...middlewares) {
         const controller = processController(middlewares)
         processPath('GET', path, middlewares, controller)
      },
      post(path, ...middlewares) {
         const controller = processController(middlewares)
         processPath('POST', path, middlewares, controller)
      },
      put(path, ...middlewares) {
         const controller = processController(middlewares)
         processPath('PUT', path, middlewares, controller)
      },
      delete(path, ...middlewares) {
         const controller = processController(middlewares)
         processPath('DELETE', path, middlewares, controller)
      },
      /**
       * 生成rest api
       * @param {String} path 
       * @param {...Function} middlewares 
       */
      resources(path, ...middlewares) {

         const controllerPath = middlewares.pop()
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
                  const { type, parameter } = Resources[name]
                  processPath(type, path + parameter, middlewares, action)
               }
            }

         } else {

            throw new Error(`REST路由指定${controllerPath}控制器不存在`)

         }

      }
   }

   Object.assign(app, router)

}


// 加载组件路由配置文件
try {
   for (const name in components) {
      router(components[name])
      require(path.join(root, 'apps', name, 'router.js'))
   }
} catch (error) {
   console.warn(error)
}