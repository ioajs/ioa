'use strict';

const consoln = require('consoln');
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
   apps: {},
   components: {},
   cwd: process.cwd(),
   NODE_ENV,
   loader,
   /**
    * 全局共享属性
    * @param {String} key 属性名
    * @param {*} value 属性值
    */
   emit(key, value) {

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

consoln.log(`NODE_ENV = '${NODE_ENV}'`);

module.exports = ioa;