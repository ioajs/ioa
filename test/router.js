import test from 'jtm';
import api, { globalMiddlewares } from '@ioa/api';
import { Schema, $index, string, number, func, object } from 'typea';

test('router', t => {

  const schema = Schema({
    globalMiddlewares: [...Function],
    api: {
      get() { },
      post() { },
      put() { },
      del() { }
    },
  });

  const { data, error } = schema.verify({ api, globalMiddlewares });

  t.ok(data, error);

})
