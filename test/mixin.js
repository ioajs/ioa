import test from 'jtm';
import consoln from 'consoln';
import mixin from '../lib/mixin.js';

test('mixin', async t => {

   const sub = { j: 1, u: 88 };

   const data = {
      a: 1,
      b: {
         b1: {
            m: 88
         },
         b2: 5
      },
      sub,
      m: 3
   };

   const join = {
      // a: 1,
      b: {
         b1: {
            s: 666,
            // m: 35
         },
         l: 99
      },
      sub,
      p: 5
   };

   const result = mixin(data, join);

   if (result) {

      consoln.error(new Error(`data${result}存在合并冲突`));

   }

   t.deepEqual(data, {
      a: 1,
      b: { b1: { m: 88, s: 666 }, b2: 5, l: 99 },
      sub: { j: 1, u: 88 },
      m: 3,
      p: 5
   });

})