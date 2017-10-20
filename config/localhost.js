module.exports = {
   host: "http://localhost",
   fileHost: "http://localhost/",
   mongodb: {
      // connurl: 'mongodb://localhost/bank',//本地
      connurl: 'mongodb://biao:biao@119.23.216.58/bank',//测试
   },
   postgre: {
      // connurl: 'postgres://biao:biao@localhost:5432/bank',//本地
      connurl: 'postgres://biao:biao@119.23.216.58:5432/bank',//测试
   },
   wechatApp: {
      appid: "wx315d9aa53ff40321",
      mch_id: "1354885202",
      mch_key: "A20d8eir93ofEG93049koP30E8FKZM4d",
      notifyUrl: 'http://api.biaojingli.com:3000/api/v1/notify/wxpay/'
   },
   alipay: {
      appId: "2017072407878301",
      notifyUrl: 'http://api.biaojingli.com:3000/api/v1/notify/alipay/'
   },
}