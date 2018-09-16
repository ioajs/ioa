'use strict';

const test = require('jtf')
const { axios } = require('../helpers')

test('get /role/', async t => {
   let { data } = await axios.get("/role")
   t.deepEqual('role index', data)
});


test('get /role/:id', async t => {
   let { data } = await axios.get("/role/998")
   t.deepEqual('role details', data)
});
