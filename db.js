global.Sequelize = require('sequelize');
global.DB = new Sequelize('thinkjs', 'postgres', 'admin', {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432
});

module.exports = DB