module.exports = {
	host: "http://app.biaojingli.com",
	fileHost: "http://files.biaojingli.com/",
	redis: {
		port: 6379,
		ip: "127.0.0.1",
		auth_pass: "biaojingli",
		options: {}
	},
	mongodb: {
		connurl: 'mongodb://biao:biao@localhost/bank',
	},
	postgre: {
		connurl: 'postgres://biao:biao@localhost:5432/bank',
	},
	wechatApp: {
		appid: "wx315d9aa53ff40321",
		mch_id: "1354885202",
		mch_key: "A20d8eir93ofEG93049koP30E8FKZM4d",
		notifyUrl: (() => {
			if (process.env.PORT === "3000") {
				return "http://api.biaojingli.com:3000/api/v1/notify/wxpay/"
			} else {
				return "https://api.biaojingli.com/api/v1/notify/wxpay/"
			}
		})()
	},
	alipay: {
		appId: "2017072407878301",
		notifyUrl: (() => {
			if (process.env.PORT === "3000") {
				return "http://api.biaojingli.com:3000/api/v1/notify/alipay/"
			} else {
				return "https://api.biaojingli.com/api/v1/notify/alipay/"
			}
		})()
	},
}