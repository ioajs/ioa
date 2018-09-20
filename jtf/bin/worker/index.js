'use strict';

const path = require('path')
const helper = require('../helper')

// 环境变量路由
if (process.env.global) {

   // 全局监听模式，执行入口文件
   let absolutePath = path.join(helper.cwd, process.env.global)

   require(absolutePath)

} else {

   const loads = process.env.loads.split(',')

   const tests = helper.getTests(loads)

   if (process.env.async) {

      require('./async')(tests)

   } else {

      require('./sync')(tests)
      
   }

}