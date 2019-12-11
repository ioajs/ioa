'use strict';

const test = require('jtf')
const axios = require('axios');

test('get', async t => {
   const { data } = await axios.get("/common")
   t.deepEqual('common index', data)
})

test('get details', async t => {
   const { data } = await axios.get("/common/123")
   t.deepEqual("common details", data)
})