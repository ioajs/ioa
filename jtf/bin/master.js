'use strict';

const argvRouter = require('argv-router');
const load = require('./load')

let options = {
   /**
    * 默认行为，执行一次后退出
    */
   '--default'() {

      load.master()

   },
   /**
    * 查看版本信息
    */
   '-v, --version'() {

      let json = require('../package.json')

      console.log(json.version)

   },
   /**
    * 启用文件变更监听
    */
   '-w, --watch'() {

      load.watch()

   },
   /**
    * async异步模式
    */
   '-a, --async'() {

      load.master({ async: true })

   },
   /**
    * 同时启用watch、async
    */
   '-w -a'() {

      load.watch({ async: true })

   },
   /**
    * 同步执行指定的测试文件
    */
   '[file]'(argv) {

      load.master({ loads: argv.file })

   },
   /**
    * 在监听模式下执行特定的测试文件
    */
   '[file] -w'(argv) {

      load.watch({ loads: argv.file })

   },
   /**
    * 异步执行指定测试文件
    */
   '[file] -a'(argv) {

      load.master({ loads: argv.file, async: true })

   },
   /**
    *  全局监听模式执行特定入口文件，不执行测试代码
    */
   '-g <>'(argv) {

      load.globel({ global: argv['-g'] })

   },
   /**
    *  全局测试监听模式，不仅限于测试文件
    */
   '[file] -w -g'(argv) {

      console.log(argv.file)

   }
}


argvRouter(options, '--default')