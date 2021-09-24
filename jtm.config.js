import test from 'jtm';
import ioa from 'ioa';
import axios from 'axios';

test.axios = axios;

axios.defaults.baseURL = `http://localhost:8600`;

console.time('test');

await ioa.apps(
  "./main",
  "./admin",
  "./user"
);

console.timeEnd('test');
