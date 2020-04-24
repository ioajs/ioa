'use strict';

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

module.exports = argv;