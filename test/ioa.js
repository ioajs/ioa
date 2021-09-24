import test from 'jtm';
import typea from 'typea';
import ioa from 'ioa';

const component = {
  '$name': String,
  '$path': String,
  '$release': {},
  '$subscribe': {},
  '$emitData': {},
  loads: {},
  import: Function,
  export: Function,
  $indexPath: String
}

const main = {
  ...component,
  middlewareBefore: [Function],
  router: {
    get: Function,
    post: Function,
    put: Function,
    delete: Function,
    resources: Function
  },
  config: {
    mixin: { a: 666 }
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
      index: Function,
      sms: Function,
      login: Function,
    },
    index: {
      test: Function,
    },
    news: {
      index: Function,
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
  virtual: 888
}

const admin = {
  ...component,
  middlewareBefore: [Function],
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
  model: { compcerts: undefined },
  middleware: {
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
  test: 999
}

const user = {
  ...component,
  middlewareBefore: [Function],
  router: {
    get: Function,
    post: Function,
    put: Function,
    delete: Function,
    resources: Function
  },
  config: {},
  middleware: {
    test: Function,
    intercept: Function
  },
  controller: {
    home: {
      home: Function,
    }
  }
}

const schema = typea({
  argv: { default: [] },
  version: String,
  NODE_ENV: String,
  apps: Function,
  components: {
    '@ioa/config': component,
    '@ioa/koa': component,
    '@common': component,
  },
  applications: {
    main,
    admin,
    user,
  },
  main,
});

test('ioa', t => {

  const { data, error } = schema.strictVerify(ioa);

  t.ok(data, error);

})