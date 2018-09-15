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


test('resources get /rest/:name', async t => {
   let { data } = await axios.get("/rest/sss")
   t.deepEqual({ name: 'sss' }, data)
});

test('resources get /rest/:name/:id', async t => {
   let { data } = await axios.get("/rest/xx/888")
   t.deepEqual({ id: '888', name: 'xx' }, data)
});

test('resources post /rest/:name', async t => {
   let body = { xx: 666 }
   let { data } = await axios.post("/rest/xx", body)
   t.deepEqual(body, data)
});

test('resources put /rest/:name/:id', async t => {
   let body = { sss: 888 }
   let { data } = await axios.put("/rest/xx/999", body)
   t.deepEqual({ body, parameter: { name: 'xx', id: '999' } }, data)
});

test('resources delete /rest/:name/:id', async t => {
   let { data } = await axios.delete("/rest/kk/999")
   t.deepEqual({ name: 'kk', id: '999' }, data)
})