module.exports = app => {
  let tests = DB.define('tests', {
    'emp_id': {
      'type': Sequelize.STRING
    },
    'nick': {
      'type': Sequelize.STRING
    },
    'department': {
      'type': Sequelize.STRING
    }
  });
  return {
    async insert(data) {
      let response = await tests.create(data)
      if (response) {
        return response
      } else {
        return { error: '获取失败' }
      }
    },
    async get(id) {
      let response = await tests.findById(Number(id))
      if (response) {
        return response.dataValues
      } else {
        return { error: '获取失败' }
      }
    }
  }
}