import { createApp } from 'ioa';

console.time('test');

await createApp({
  main: "./main",
  admin: "./admin",
  user: "./user"
});

console.timeEnd('test');
