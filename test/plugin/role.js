'use strict';

const test = require('jtf')
const { axios } = require('../helpers')

test('get /role', async t => {
   let { data } = await axios.get("/role")
   t.deepEqual('role', data)
});

