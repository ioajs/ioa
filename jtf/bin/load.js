'use strict';

const fs = require('fs');
const path = require("path")
const nft = require('nft')
const cluster = require('cluster')
const helper = require('./helper')

let loads = []

module.exports = {
   /**
    * 文件监听模式
    * @param {Object} options 环境变量配置
    */
   watch(options = {}) {

      if (options.loads) {

         this.loadsPath(options.loads)

         for (let filePath of options.loads) {
            this.watchFile(options, filePath)
         }

      } else {

         this.fileTree(function (filePath) {

            loads.push(filePath)

            this.watchFile(options, filePath)

         })

         options.loads = loads

      }

      workers(options)

   },
   /**
    * 直接用master进程运行测试文件，不启用监听
    * @param {Object} options 
    */
   master(options = {}) {

      // 加载指定测试文件
      if (options.loads) {

         loads = this.loadsPath(options.loads)

      }

      // 按目录加载
      else {

         this.fileTree(function (filePath) {

            if (/\.js$/.test(filePath)) {

               loads.push(filePath)

            }

         })

      }

      const tests = helper.getTests(loads)

      if (options.async) {
         require('./worker/async')(tests)
      } else {
         require('./worker/sync')(tests)
      }

   },
   /**
    * 
    * @param {Function} file 每个被遍历文件的处理函数
    */
   fileTree(file) {

      const result = helper.require('package.json')
      const config = result && result.config && result.config.jtf

      if (config) {
         for (let name in config) {
            let item = config[name]
            item.file = file
         }
      }

      nft({
         "test": {
            "path": "test/",
            "exclude": ['helpers'],
            file
         },
         ...config
      })

   },
   /**
    * 监听指定文件
    * @param {*} filePath 文件path
    */
   watchFile(options, filePath) {

      fs.watchFile(filePath, { interval: 600 }, function (current, previous) {

         if (Date.parse(current.mtime) !== Date.parse(previous.mtime)) {
            workers(options)
         } else if (Date.parse(current.mtime) == 0) {
            workers(options)
         }

      })

   },
   /**
    * 为loads补齐path
    * @param {Array} loads 
    */
   loadsPath(loads) {

      for (let key in loads) {
         loads[key] = path.join(helper.cwd, loads[key])
      }

      return loads

   },
   /**
    * 启用全局监听模式，通过子进程运行
    */
   globel(options) {

      nft({
         "globel": {
            "path": "/",
            file(filePath) {

               fs.watchFile(filePath, { interval: 600 }, function (current, previous) {

                  if (Date.parse(current.mtime) !== Date.parse(previous.mtime)) {
                     workers(options)
                  } else if (Date.parse(current.mtime) == 0) {
                     workers(options)
                  }

               })

            }
         }
      })

      workers(options)

   },
}


/**
 * 重置workers
 */
function workers(options) {

   // 清空worker
   for (const id in cluster.workers) {
      let worker = cluster.workers[id]
      worker.process.kill()
   }

   // 仅启用一个worker用于执行测试代码
   cluster.fork(options)

}

// const numCPUs = require('os').cpus().length;

// cluster.on('exit', (worker) => {
//    console.log(`exit ${worker.process.pid}`);
// });