'use strict';

const { config } = require('../../loader');
const loader = require('@ioa/http/loader');

module.exports = {
   config,
   ...loader
}