// PGSQL

// global.Sequelize = require('sequelize');
// global.DB = new Sequelize('thinkjs', 'postgres', 'admin', {
//   dialect: 'postgres',
//   host: 'localhost',
//   port: 5432
// });

// Mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/local');

// 连接状态反馈
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('成功连接mongodb')
});

var kittySchema = mongoose.Schema({
    name: String
});

// 输出模型构造函数
var goodsModel = mongoose.model('goods', kittySchema);

// 生成模型实例
var goods = new goodsModel({ name: 'Zildjian' });

// 创建表
// goods.save();

goods.find({}, function (err, docs) {
  console.log(err)
});

module.exports = db