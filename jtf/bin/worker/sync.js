'use strict';

const assert = require('./assert')
const { success, error } = require('./console')
const { getDate } = require('../helper')

module.exports = async function run(tests) {

   console.log(`\n\x1b[30m»»»»»»»»»»»»»»» ${getDate()} «««««««««««««««`)

   for (let item of tests) {

      if (item instanceof Object) {

         let { type, name, func } = item

         // 默认类型
         if (type === undefined) {

            let timestamp = Date.now()

            assert.state = false

            if (func.constructor.name === 'AsyncFunction') {

               await func(assert).then(data => {

                  if (assert.state === true) {

                     success(name, timestamp)

                  } else {

                     error(name, timestamp, '未执行断言')

                  }

               }).catch(e => {

                  error(name, timestamp, e.stack)

               })

            } else {

               try {

                  func(assert)

                  if (assert.state === true) {

                     success(name, timestamp)

                  } else {

                     error(name, timestamp, '未执行断言')

                  }

               } catch (e) {

                  error(name, timestamp, e.stack)

               }

            }

         } else if (type === 'skip') {

            console.log(`\n\x1b[33m» skip ${name}\x1b[30m`)

         }

      } else {

         let filePath = item.split(/[\\/]/).slice(-3).join(' » ')

         console.log(`\n\x1b[35m${filePath}\x1b[30m`)

      }

   }

}