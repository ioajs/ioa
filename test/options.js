const { models } = App.Middleware

let User = {
   // 用户地址
   address: {
      get: {
         model: [{
            addressee: String,
            address: String,
            addresseeTelephone: String
         }]
      },
      create: {
         model: [{
            addressee: String,
            address: String,
            addresseeTelephone: String
         }]
      },
      update: {
         model: [{
            addressee: String,
            address: String,
            addresseeTelephone: String
         }]
      },
      delete: {
         model: [{
            addressee: String,
            address: String,
            addresseeTelephone: String
         }]
      }
   },
   // 设置默认用户地址
   defaultAddress: {
      update: {
         type: "ObjectId",
         origin: 'body.id'
      }
   }
}

module.exports = models('User', User)