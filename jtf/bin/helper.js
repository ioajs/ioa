"use strict"

const path = require('path')
const cwd = path.join(process.cwd())

module.exports = {
   cwd,
   /**
    * 获取当前本地格式化时间
    */
   getDate() {

      const nowDate = new Date()

      const hours = nowDate.getHours()

      const minutes = nowDate.getMinutes()

      const seconds = nowDate.getSeconds()

      return `${hours}:${minutes}:${seconds}`

   },
   /**
    * 获取测试函数队列
    * @param {Array} loads path数组
    */
   getTests(loads) {

      // const container = this.require(cwd, 'index')

      const container = this.require('node_modules', 'jtf', 'index')

      if (!container) {
         throw new Error('本地未安装jtf依赖')
      }

      const { tests } = container

      for (let filePath of loads) {
         tests.push(filePath)
         require(filePath)
      }

      return tests

   },
   /**
    * 加载本地模块，忽略错误
    * @param  {...any} filePath 模块路径
    */
   require(...filePath) {

      let data

      try {
         filePath = path.join(cwd, ...filePath)
         data = require(filePath)
      } catch (error) {

      }

      return data

   }
}