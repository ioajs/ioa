'use strict';

/**
 * 为跨组件资源预构建getter访问器
 */

const root = require('..')

const { apps } = root
const { toString } = Object.prototype

/**
 * import配置解析器
 * @param {*} options 映射表达式
 * @param {*} input 导出数据
 */
function Import(options, input) {

   if (toString.call(options) === '[object Object]') {

      for (const name in options) {

         const value = options[name]

         if (typeof value === 'string') {

            const [appName, ...valPath] = value.split(".")

            let output = apps[appName]

            if (output) {

               for (const item of valPath) {
                  if (output[item] === undefined) {
                     output[item] = {}
                  }
                  output = output[item]
               }

            } else {

               return `缺少${appName}组件依赖`

            }

            Object.defineProperty(input, name, {
               enumerable: true,
               get() {
                  return output[name]
               },
               set(value) {
                  return value
               }
            })

         } else {

            if (input[name] === undefined) {
               input[name] = {}
            }

            const error = Import(value, input[name])

            if (error) {
               return error
            }

         }

      }

   }

}

module.exports = Import