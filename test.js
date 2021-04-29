console.time('test')

import { loadApp } from 'ioa';

await loadApp(
  "./main",
  "./admin",
  "./user"
);

// console.log(ioa.main);

console.timeEnd('test');

// setTimeout(() => {
//   console.log(ioa.main)
// }, 500);
