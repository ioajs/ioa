'use strict';

const test = require('jtf')
const typea = require('typea')

const ioa = require('..')

ioa.http()

test('ioa', t => {

   const { data, error } = typea.strict(ioa, {
      version: String,
      cwd: String,
      NODE_ENV: String,
      logger: Function,
      AppsMiddleware: Array,
      mode: "apps",
      main: Object,
      user: Object,
      admin: Object,
      apps: {
         main: {
            apps: Object,
            config: {
               middleware: [String]
            },
            other: {
               a: Object,
               b: Object,
            },
            model: {
               compcerts: Object
            },
            middleware: {
               cors: Function,
               token: Function
            },
            AppMiddleware: [Function],
            controller: {
               index: {
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
            router: {
               get: Function,
               post: Function,
               put: Function,
               delete: Function,
               resources: Function
            }
         },
         user: {
            apps: Object,
            config: {
               middleware: [String]
            },
            middleware: {
               test: Function,
               intercept: Function,
               cors: Function,
            },
            AppMiddleware: [Function],
            controller: {
               index: {
                  home: Function,
               }
            },
            router: {
               get: Function,
               post: Function,
               put: Function,
               delete: Function,
               resources: Function
            }
         },
         admin: {
            apps: Object,
            Controller: Function,
            Model: Function,
            config: {
               middleware: [String]
            },
            model: { compcerts: Object },
            middleware: {
               cors: Function,
               token: Function
            },
            AppMiddleware: [Function],
            controller: {
               index: {
                  index: Function,
                  details: Function,
                  add: Function,
                  update: Function,
                  delete: Function
               }
            },
            router: {
               get: Function,
               post: Function,
               put: Function,
               delete: Function,
               resources: Function
            }
         },
      },
      http: Function,
   })

   t.ok(data, error)

})