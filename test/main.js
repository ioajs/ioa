'use strict';

const test = require('jtf')
const { axios } = require('./helpers')

test('get /', async t => {
   let { data } = await axios.get("/")
   t.ok(data)
});

test('get /news', async t => {
   let { data } = await axios.get("/news")
   t.ok(data)
});

test('get /sms/:id/sd/:kk', async t => {
   let { data } = await axios.get("/sms/666/sd/888")
   t.deepEqual({ id: '666', kk: '888' }, data)
});

test('get /admin', async t => {
   let { data } = await axios.get("/admin")
   t.deepEqual('details', data)
});


test('post /login', async t => {
   let body = { xx: 666 }
   let { data } = await axios.post("/login", body)
   t.deepEqual({ type: 'login', body }, data)
});


test('post /sms/:id/sd/:kk', async t => {
   let { data } = await axios.post("/sms/55/sd/66", {})
   t.deepEqual({ id: "55", kk: "66" }, data)
});


test('resources get /rest', async t => {
   let { data } = await axios.get("/rest")
   t.deepEqual({}, data)
});

test('resources get /rest/:id', async t => {
   let { data } = await axios.get("/rest/888")
   t.deepEqual({ id: '888' }, data)
});

test('resources post /rest', async t => {
   let body = { xx: 666 }
   let { data } = await axios.post("/rest", body)
   t.deepEqual(body, data)
});

test('resources put /rest/:id', async t => {
   let body = { sss: 888 }
   let { data } = await axios.put("/rest/999", body)
   t.deepEqual({ body, parameter: { id: '999' } }, data)
});

test('resources delete /rest/:id', async t => {
   let { data } = await axios.delete("/rest/999")
   t.deepEqual({ id: '999' }, data)
})