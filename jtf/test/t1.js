let test = require('..');
let { sleep } = require('./helpers/')

test('deepEqual', async t => {

   t.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 });

})


test('equal', async t => {

   await sleep(3000)

   t.equal(12121, 12121)

   t.equal(12121, 12121)

})


test('ok', t => {

   t.ok(!false, '值必须为true');

})

test.skip('ok', t => {

   t.ok(!false, '值必须为true');

})