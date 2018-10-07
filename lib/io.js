/**
 * 为跨应用预构建getter访问路径
 */

'use strict';

const toString = Object.prototype.toString

/**
 * io配置解析器
 * @param {*} options 映射模型
 * @param {*} input 输入
 * @param {*} output 输出
 */
function io(options, input, output) {

   if (toString.call(options) === '[object Object]') {

      for (const name in options) {

         const option = options[name]
         
         if (option === true) {
            Object.defineProperty(output, name, {
               enumerable: true,
               get() {
                  return input[name]
               },
               set(value) {
                  return value
               }
            })
         } else {
            if (!input[name]) {
               input[name] = {}
            }
            if (!output[name]) {
               output[name] = {}
            }
            io(option, input[name], output[name])
         }

      }

   }

}

module.exports = io