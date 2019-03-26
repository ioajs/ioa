'use strict';

const test = require('jtf');
const typea = require('typea');
const axios = require('axios');
const ioa = require('..');

ioa.loader();

ioa.http();

const { port } = ioa;

axios.defaults.baseURL = `http://localhost:${port}`;

test('ioa', t => {

   const { data, error } = typea.strict(ioa, {
      version: String,
      cwd: String,
      NODE_ENV: String,
      logger: Function,
      loader: Function,
      beforeMiddleware: Array,
      main: Object,
      port: Number,
      apps: {
         main: {
            $beforeMiddleware: [Function],
            router: {
               get: Function,
               post: Function,
               put: Function,
               delete: Function,
               resources: Function
            },
            config: {
               "port": Number,
               "mixin": {
                  a: 666
               },
               '@components': Object
            },
            model: {
               document: Object
            },
            middleware: {
               cors: Function,
               token: Function
            },
            controller: {
               home: {
                  home: Function,
                  sms: Function,
                  login: Function,
               },
               news: {
                  home: Function,
                  details: Function,
               },
               rest: {
                  index: Function,
                  details: Function,
                  create: Function,
                  update: Function,
                  destroy: Function
               },
               test: {
                  index: Function,
                  details: Function,
                  create: Function,
                  update: Function,
                  destroy: Function
               }
            },
            other: {
               a: Object,
               b: Object,
            },
         },
         admin: {
            $beforeMiddleware: [Function],
            router: {
               get: Function,
               post: Function,
               put: Function,
               delete: Function,
               resources: Function
            },
            config: {
               base: String
            },
            model: { compcerts: Object },
            middleware: {
               auth: Function,
               role: Function,
               token: Function,
            },
            controller: {
               home: {
                  index: Function,
                  details: Function,
                  add: Function,
                  update: Function,
                  delete: Function
               }
            },
         },
         user: {
            $beforeMiddleware: [Function],
            router: {
               get: Function,
               post: Function,
               put: Function,
               delete: Function,
               resources: Function
            },
            config: {
               port: Number
            },
            middleware: {
               test: Function,
               intercept: Function
            },
            controller: {
               home: {
                  home: Function,
               }
            }
         },
      },
      components: {
         "@ioa/http": Object,
         "@ioa/model": Object,
         "@ioa/auth": Object,
      },
      http: Function,
   });

   t.ok(data, error);

})