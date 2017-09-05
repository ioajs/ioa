
exports.model = {
   params: {
      username: {
         type: Number,
         name: "用户名",
      }
   },
   query: {
      min: 15,
   },
   body: {
      typeId: {
         type: Number,
      },
      money: {
         type: Number
      }
   }
}

exports.create = {
   model: {
      typeId: {
         type: Number,
         bind: "coupon.$"
      }
   },
   action(input) {

   }
}

exports.update = {}

exports.delete = {}