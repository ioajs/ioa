const { models } = App.Middleware

module.exports = {
   // 公共数据模型
   model: {
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
   },
   // 添加
   create: {
      model: {
         typeId: {
            type: Number,
            bind: "coupon.$"
         }
      },
      action(input) {

      }
   },
   // 更新
   update() {

   },
   // 删除
   delete() {

   }
}