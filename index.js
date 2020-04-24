'use strict';

const consoln = require('consoln');
const loader = require('./lib/loader.js');
const argv = require('./lib/argv.js');
const { version } = require('./package.json');

let { NODE_ENV } = process.env;

if (NODE_ENV) {
   NODE_ENV = NODE_ENV.trim();
} else if (argv.env) {
   NODE_ENV = argv.env[0];
} else {
   NODE_ENV = 'production';
}

console.log('');

consoln.log(`Ioa Framework V${version}`);
consoln.log(`NODE_ENV = '${NODE_ENV}'`);

module.exports = {
   argv,
   apps: {},
   components: {},
   loaders: [],
   loader,
   NODE_ENV,
   cwd: process.cwd(),
   version
};