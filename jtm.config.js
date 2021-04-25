import test from 'jtm';
import axios from 'axios';
import ioa from 'ioa';

test.axios = axios;

axios.defaults.baseURL = `http://localhost:8600`;

await ioa.loadApp(
  "./main",
  "./admin",
  "./user"
);
