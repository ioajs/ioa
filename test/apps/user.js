'use strict';

const test = require('jtf');
const axios = require('axios');

test('get', async t => {
   const { data } = await axios.get("/user")
   t.deepEqual('user home', data)
})

test('get details', async t => {
   const { data } = await axios.get("/user/123")
   t.deepEqual("user details", data)
})

test('get 中间件拦截', async t => {
   const { data } = await axios.get("/user/intercept")
   t.deepEqual('中间件拦截', data)
})

