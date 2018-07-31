import test from 'ava';
// import check from 'check-data';
import axios from 'axios'
import app from '../../';

app.listen(8800)

axios.defaults.baseURL = 'http://localhost:8800';

test('get /', async t => {
   let { data } = await axios.get("/")
   t.truthy(data);
});

test('get /news', async t => {
   let { data } = await axios.get("/news")
   t.truthy(data);
});

test('get /sms/:id/sd/:kk', async t => {
   let { data } = await axios.get("/sms/666/sd/888")
   t.deepEqual(data, { id: '666', kk: '888' })
   // t.truthy(data);
});

test('get /admin', async t => {
   let { data } = await axios.get("/admin")
   t.deepEqual(data, 'details')
});


test('post /login', async t => {
   let body = { xx: 666 }
   let { data } = await axios.post("/login", body)
   t.deepEqual(data, { type: 'login', body });
});


test('post /sms/:id/sd/:kk', async t => {
   let { data } = await axios.post("/sms/55/sd/66", {})
   t.deepEqual(data, { id: "55", kk: "66" });
});

test('resources get /rest/:name', async t => {
   let { data } = await axios.get("/rest/sss")
   t.deepEqual(data, { name: 'sss' });
   // t.truthy(data);
});

test('resources get /rest/:name/:id', async t => {
   let { data } = await axios.get("/rest/xx/888")
   t.deepEqual(data, { id: '888', name: 'xx' });
});

test('resources post /rest/:name', async t => {
   let body = { xx: 666 }
   let { data } = await axios.post("/rest/xx", body)
   t.deepEqual(data, body);
});

test('resources put /rest/:name/:id', async t => {
   let body = { sss: 888 }
   let { data } = await axios.put("/rest/xx/999", body)
   t.deepEqual(data, { body, parameter: { name: 'xx', id: '999' } });
});

test('resources delete /rest/:name/:id', async t => {
   let { data } = await axios.delete("/rest/kk/999")
   t.deepEqual(data, { name: 'kk', id: '999' });
});