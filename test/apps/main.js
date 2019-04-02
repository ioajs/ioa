'use strict';

const test = require('jtf')
const axios = require('axios');


test('get /', async t => {
   const { data } = await axios.get("/")
   t.ok(data)
});


test('get /news', async t => {
   const { data } = await axios.get("/news")
   t.ok(data)
});


test('get /sms/:id/sd/:kk', async t => {
   const { data } = await axios.get("/sms/666/sd/888")
   t.deepEqual(data, { id: '666', kk: '888' })
});


test('post /login', async t => {
   const body = { xx: 666 }
   const { data } = await axios.post("/login", body)
   t.deepEqual(data, { type: 'login', body })
});


test('post /sms/:id/sd/:kk', async t => {
   const { data } = await axios.post("/sms/55/sd/66", {})
   t.deepEqual(data, { id: "55", kk: "66" })
});


test('resources get /rest', async t => {
   const { data } = await axios.get("/rest")
   t.deepEqual(data, {})
});


test('resources get /rest/:id', async t => {
   const { data } = await axios.get("/rest/888")
   t.deepEqual(data, { id: '888' })
});


test('resources post /rest', async t => {
   const body = { xx: 666 }
   const { data } = await axios.post("/rest", body)
   t.deepEqual(data, body)
});


test('resources put /rest/:id', async t => {
   const body = { sss: 888 }
   const { data } = await axios.put("/rest/999", body)
   t.deepEqual(data, { body, params: { id: '999' } })
});


test('resources delete /rest/:id', async t => {
   const { data } = await axios.delete("/rest/999")
   t.deepEqual(data, { id: '999' })
})