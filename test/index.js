import test from 'ava';
import check from 'check-data';
import app from '..';


test('app', t => {

   let { data, error } = check.strict(app, {
      Controller: Function,
      root: String,
      config: {
         middlewares: [Function],
         port: Number,
      },
      extend: {
         application: Number,
         db: Object,
         emulates: {
            mobile: Object,
            pc: Object,
         }
      },
      application: Number,
      db: Object,
      emulates: {
         mobile: Object,
         pc: Object,
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
      get: undefined,
      post: undefined,
      put: undefined,
      delete: undefined,
      resources: undefined
   })

   t.truthy(data, error);

});