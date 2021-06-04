console.time('test')

import ioa from 'ioa';

await ioa.apps(
  "./main",
  "./admin",
  "./user"
);

// console.log(ioa.main);

console.timeEnd('test');

// setTimeout(() => {
//   console.log(ioa.main)
// }, 500);
