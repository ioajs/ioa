'use strict';

const test = require('jtf')
const axios = require('axios');

test('get /admin/', async t => {
   const { data } = await axios.get("/admin")
   t.deepEqual('admin index', data)
});


test('get /admin/:id', async t => {
   const { data } = await axios.get("/admin/998")
   t.deepEqual('admin details', data)
});
