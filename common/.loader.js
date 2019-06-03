'use strict';

const component = require('@app');

component.loader({
   "@ioa/koa": {
      "enable": true,
   },
   '@ioa/auth': {
      "enable": true
   },
});

const { levels } = component;

module.exports = {
   ...levels,
   "roles.js": {
      'level': 22
   },
};