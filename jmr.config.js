'use strict';

const test = require('jmr');
const axios = require('axios');
const ioa = require('ioa');

axios.defaults.baseURL = `http://localhost:8600`;

ioa.app(
  "./main",
  "./admin",
  "./user"
);

test.axios = axios;