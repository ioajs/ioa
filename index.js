'use strict';

const logger = require('loggercc');
const loader = require('./lib/loader.js');
const { version } = require('./package.json');

let { NODE_ENV } = process.env;

if (NODE_ENV) {
   NODE_ENV = NODE_ENV.trim();
} else {
   NODE_ENV = 'production';
}

const ioa = {
   version,
   logger,
   apps: {},
   components: {},
   cwd: process.cwd(),
   NODE_ENV,
   loader,
   /**
    * 全局共享属性
    * @param {*} key 属性名
    * @param {*} value 属性值
    */
   shared(key, value) {

      const { apps } = this;

      for (const name in apps) {

         const app = apps[name];
         const node = app[key];
         if (node) {
            Object.assign(node, value);
         }

      }

   }
}

console.log('');

logger.log(`NODE_ENV = '${NODE_ENV}'`);

module.exports = ioa;