import test from 'jtm';
import types from 'typea';
import ioa, { main as mainApp } from 'ioa';

const base = {
  $name: String,
  $path: String,
  $components: Object,
  $import: Object,
  $export: Object,
  import: Function
}

const component = {
  ...base,
  $release: Object,
  export: Function
}

const main = {
  ...base,
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
  ...base,
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
  ...base,
  config: {},
  middlewareBefore: [Function],
  router: {
    get: Function,
    post: Function,
    put: Function,
    delete: Function,
    resources: Function
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
}

test('ioa', t => {

  const schema = types({
    argv: { default: [] },
    version: String,
    NODE_ENV: String,
    createApp: Function,
    main,
    apps: {
      main,
      admin,
      user,
    },
    components: {
      '@ioa/config': component,
      '@ioa/koa': component,
      '@common': component,
    },
  });

  const { data, error } = schema.strictVerify(ioa);

  t.ok(data, error);

})