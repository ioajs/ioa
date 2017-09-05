const { models } = App.Middleware

module.exports = models({
   modelName: ["Promotions"],
   // 数据
   data: {
      params: {
         typeId: {
            type: Number,
            bind: "coupon.$"
         }
      },
      query: {
         min: {
            type: Number,
            bind: "coupon.test"
         }
      },
      body: {
         path: "coupon.$",
         typeId: {
            type: Number,
            process(val) { }
         },
         min: {
            type: Number
         },
         max: {
            type: Number
         },
         money: {
            type: Number
         }
      }
   },
   // 行为
   action: {
      add() {

      },
      delete() {

      }
   }
})