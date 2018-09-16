'use strict';

const T = require('small-tools')
const toString = Object.prototype.toString

function io(options, input, output) {

   if (toString.call(options) === '[object Object]') {
      for (let name in options) {

         const option = options[name]

         if (typeof option === 'string') {
            if (option === 'in') {
               if (toString.call(input[name]) === '[object Object]') {
                  T(input[name]).object({ mixin: output[name] })
               } else {
                  input[name] = output[name]
               }
            } else if (option === 'out') {
               if (toString.call(output[name]) === '[object Object]') {
                  T(output[name]).object({ mixin: input[name] })
               } else {
                  output[name] = input[name]
               }
            }
         } else {
            // 当值不存在时用空对象填充
            if (!input[name]) input[name] = {}
            if (!output[name]) output[name] = {}
            io(option, input[name], output[name])
         }

      }
   }

}

module.exports = io