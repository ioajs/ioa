import { createApp } from 'ioa';

// console.time('test');

await createApp(
  "./main",
  "./admin",
  "./user"
);

// console.timeEnd('test');
