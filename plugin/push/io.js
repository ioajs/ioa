/**
 * 自定义父子级app的依赖继承关系
 */

let app = require("ioa")

module.exports = {
   config: {
      default: {
         port: {
            type: Number,
            allowNull: false
         }
      },
      development: {
         port: Number
      },
      localhost: {
         port: {
            type: Number,
            allowNull: false
         }
      },
      production: {
         port: Number
      },
   },
   app: {
      controller: Object,
      middleware: {
         type: Object,
         allowNull: false,
         set(middleware) {
            return middleware.push(...this.middleware)
         }
      }
   }
}