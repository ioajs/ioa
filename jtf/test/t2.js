let test = require('..');


test('deepEqual', t => {

   t.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })

})


test('equal', t => {

   t.equal(12121, 12121);

})


test('ok', t => {

   t.ok(!false, '值必须为true');

})