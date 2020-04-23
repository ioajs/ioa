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

console.log('');

consoln.log(`Ioa Framework V${version}`);
consoln.log(`NODE_ENV = '${NODE_ENV}'`);

// argv参数解析
const [, , ...processArgv] = process.argv;

let key = '';
const argv = {};
for (const item of processArgv) {
   if (item[0] === '-') {
      key = item.replace(/^-{1,2}/, '');
      argv[key] = [];
   } else {
      argv[key].push(item);
   }
}

module.exports = {
   version,
   apps: {},
   components: {},
   loaders: [],
   loader,
   NODE_ENV,
   cwd: process.cwd(),
   argv,
};