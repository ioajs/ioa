import { createApp } from 'ioa';

console.time()

await createApp("./app")

console.timeEnd()