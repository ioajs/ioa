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

module.exports = {
   version,
   apps: {},
   components: {},
   loaders: [],
   NODE_ENV,
   loader,
   cwd: process.cwd()
};