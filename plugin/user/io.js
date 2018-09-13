/**
 * 自定义父子级app的依赖继承关系
 */

module.exports = {
   config: 'inherit',
   app: {
      controller: 'inherit',
      middleware: 'inherit',
      model: 'inherit'
   }
}