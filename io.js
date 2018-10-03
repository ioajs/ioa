'use strict';

const toString = Object.prototype.toString


/**
 * io配置解析器
 * @param {*} options 映射模型
 * @param {*} input 输入
 * @param {*} output 输出
 */
function io(input, output, options) {

   if (toString.call(options) === '[object Object]') {

      if (toString.call(input) !== '[object Object]') {
         return {}
      }

      if (toString.call(output) !== '[object Object]') {
         return {}
      }

      for (const name in options) {

         if (!input[name]) input[name] = {}

         if (!output[name]) output[name] = {}

         const { error, data } = io(input[name], output[name], options[name])

         if (error) {

            return { error: `${name}.${error}` }

         } else if (data) {

            Object.defineProperty(output, name, data)

         }

      }

      return { data: output }

   } else if (options === true) {

      return {
         data: {
            get() {
               return input
            }
         }
      }

   }

}

module.exports = io