'use strict';

const test = require('jmr');
const axios = require('axios');
const ioa = require('ioa');

test.axios = axios;

axios.defaults.baseURL = `http://localhost:8600`;

ioa.app(
  "./main",
  "./admin",
  "./user"
);