import { createApp } from 'ioa';

console.time()

await createApp("./dist/")

console.timeEnd()
