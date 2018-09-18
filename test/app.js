const test = require('jtf')
const typea = require('typea')
const app = require('..')

app.listen(8800)

test('app', t => {

   let { data, error } = typea.strict(app, {
      version: String,
      root: String,
      NODE_ENV: String,
      Controller: Function,
      Model: Function,
      config: {
         middlewares: [String],
         port: Number,
      },
      other: {
         a: Object,
         b: Object,
      },
      typea: Function,
      model: { compcerts: Object },
      middleware: {
         cors: Function,
         token: Function
      },
      commonMiddlewares: [Function],
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
      listen: Function,
      get: Function,
      post: Function,
      put: Function,
      delete: Function,
      resources: Function
   })

   t.ok(data, error)

})