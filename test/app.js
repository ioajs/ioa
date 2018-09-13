'use strict';

const test = require('jtf')
const typea = require('typea')
const app = require('..')

test('app', t => {

   let { data, error } = typea.strict(app, {
      version: String,
      root: String,
      NODE_ENV: String,
      loader: Function,
      Controller: Function,
      Model: Function,
      config: {
         middlewares: [Function],
         port: Number,
      },
      extend: {
         application: Number,
         db: Object,
         sub: {
            a: Object,
            b: Object,
         },
      },
      application: Number,
      db: Object,
      sub: {
         a: Object,
         b: Object,
      },
      model: { compcerts: Object },
      middleware: {
         cors: Function,
         test: Function,
         token: Function
      },
      controller: {
         admin: {
            index: {
               index: Function,
               details: Function,
               add: Function,
               update: Function,
               delete: Function
            }
         },
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
      loader: Function,
      listen: Function,
      get: Function,
      post: Function,
      put: Function,
      delete: Function,
      resources: Function
   })

   t.ok(data, error)

});