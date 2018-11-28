'use strict';

const axios = require('axios')
const { port } = require('../../')

axios.defaults.baseURL = `http://localhost:${port}`;

module.exports = {
   axios
}