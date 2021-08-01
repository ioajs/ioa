import test from 'jtm';
import axios from 'axios';
import ioa from 'ioa';

test.axios = axios;

axios.defaults.baseURL = `http://localhost:8600`;

console.time('test');

await ioa.apps(
  "./main",
  "./admin",
  "./user"
);

console.timeEnd('test');
