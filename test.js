console.time('test')

import ioa from 'ioa';

await ioa.loadApp(
  "./main",
  "./admin",
  "./user"
);

// console.log(ioa.main);

console.timeEnd('test');

// setTimeout(() => {
//   console.log(ioa.main)
// }, 500);
