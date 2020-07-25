'use strict';

const test = require('jmr')

const { axios } = test;

test('get', async t => {

   const { data } = await axios.get("/common");
   t.deepEqual('common index', data);

})

test('get details', async t => {

   const { data } = await axios.get("/common/123");
   t.deepEqual("common details", data);

})