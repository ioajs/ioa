import { createApp } from 'ioa';

console.time()

await createApp("./app/dist")

console.timeEnd()
