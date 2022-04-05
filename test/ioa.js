import test from 'jtm';
import types from 'typea';
import ioa, { main as mainApp } from 'ioa';

const base = {
  $name: String,
  $path: String,
  $components: Object,
  $import: Object,
  import() { }
};

const app = {
  middlewareBefore: [function () { }],
  router: {
    get() { },
    post() { },
    put() { },
    delete() { },
    resources() { }
  },
}

const main = {
  ...base,
  ...app,
  config: {
    mixin: { a: 666 }
  },
  middleware: {
    token() { }
  },
  model: {
    document: Object
  },
  controller: {
    home: {
      index(a = String, b = Number) { return arguments },
      sms() { },
      login() { },
    },
    index: {
      test() { },
    },
    news: {
      index() { },
      details() { },
    },
    rest: {
      index() { },
      details() { },
      create() { },
      update() { },
      destroy() { }
    },
    test: {
      index() { },
      details() { },
      create() { },
      update() { },
      destroy() { }
    }
  },
  virtual: 888
};

const admin = {
  ...base,
  ...app,
  config: { base: String },
  model: { compcerts: undefined },
  middleware: {
    token() { },
  },
  controller: {
    home: {
      index() { },
      details() { },
      add() { },
      update() { },
      delete() { }
    }
  },
  test: 999
};

const user = {
  ...base,
  ...app,
  config: {},
  middleware: {
    test() { },
    intercept() { }
  },
  controller: {
    home: {
      home() { },
    }
  }
}

test('ioa', t => {

  const component = {
    ...base,
    $release: Object,
    $export: Object,
    export() { }
  };

  const schema = types({
    argv: { default: [] },
    version: String,
    NODE_ENV: String,
    createApp() { },
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