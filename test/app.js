const test = require('jtf')
const typea = require('typea')
const app = require('..')

app.listen(8800)

test('app', t => {

   const { data, error } = typea.strict(app, {
      version: String,
      cwd: String,
      NODE_ENV: String,
      Controller: Function,
      Model: Function,
      logger: Function,
      default: Function,
      apps: {
         base: {
            config: {
               middlewares: [String],
               port: Number,
            },
            other: {
               a: Object,
               b: Object,
            },
            model: { compcerts: Object },
            middleware: {
               cors: Function,
               token: Function
            },
            commonMiddlewares: [Function],
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
            get: Function,
            post: Function,
            put: Function,
            delete: Function,
            resources: Function
         },
         user: {
            sequelize: Object,
            Sequelize: Object,
            config: {
               middlewares: [String],
               port: Number,
            },
            middleware: {
               test: Function,
               intercept: Function,
               cors: Function,
            },
            commonMiddlewares: [Function],
            controller: {
               index: {
                  home: Function,
               }
            },
            get: Function,
            post: Function,
            put: Function,
            delete: Function,
            resources: Function
         },
         admin: {
            config: {
               middlewares: [String],
               port: Number,
            },
            model: { compcerts: Object },
            middleware: {
               cors: Function,
               token: Function
            },
            commonMiddlewares: [Function],
            controller: {
               index: {
                  index: Function,
                  details: Function,
                  add: Function,
                  update: Function,
                  delete: Function
               }
            },
            get: Function,
            post: Function,
            put: Function,
            delete: Function,
            resources: Function
         },
      },
      listen: Function,
   })

   t.ok(data, error)

})