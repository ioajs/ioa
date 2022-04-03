import test from 'jtm';
import axios from 'axios';
import './index.js';

test.axios = axios;

axios.defaults.baseURL = `http://localhost:8600`;
