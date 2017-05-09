module.exports = ctx => {
  let response = ctx.getModel('tests').insert({
    'emp_id': '2',
    'nick': '小明',
    'department': '技术部'
  })
  ctx.body = 'admin'
}